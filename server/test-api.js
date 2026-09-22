const http = require('http');
const app = require('./server');

const TEST_PORT = 5099;
let server;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const req = http.request({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api' + path,
      method: options.method || 'GET',
      headers
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting GlowWear 2.0 API End-to-End Verification Tests...\n');
  server = app.listen(TEST_PORT);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('/health');
    assert(health.status === 200 && health.data.status === 'online', 'Server health check responds 200 OK');

    // 2. Authentication: Register Alice
    const aliceEmail = `alice_${Date.now()}@test.com`;
    const regAlice = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Alice Walker', email: aliceEmail, password: 'password123' }
    });
    assert(regAlice.status === 201 && regAlice.data.token, 'Alice registers successfully with JWT');
    const aliceToken = regAlice.data.token;

    // 3. User Isolation: Alice cannot access Admin routes
    const aliceAdminAttempt = await request('/admin/analytics', {
      headers: { Authorization: `Bearer ${aliceToken}` }
    });
    assert(aliceAdminAttempt.status === 403, 'Regular user (Alice) is blocked from Admin endpoints (403 Forbidden)');

    // 4. Create Collection
    const createCol = await request('/collections', {
      method: 'POST',
      headers: { Authorization: `Bearer ${aliceToken}` },
      body: { title: 'Alice Summer Outfits', description: 'Pastels & floral dresses', emoji: '👗', isPublic: true }
    });
    assert(createCol.status === 201 && createCol.data.collection.id, 'Alice creates a collection with public shareId');
    const collectionId = createCol.data.collection.id;
    const shareId = createCol.data.collection.shareId;

    // 5. Universal Product Saver: Save Product
    const testUrl = 'https://www.myntra.com/dresses/test/sample-dress-123/buy?utm_source=test';
    const saveProd = await request('/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${aliceToken}` },
      body: {
        title: 'Floral Silk Slip Dress',
        price: 899,
        originalPrice: 2499,
        platform: 'Myntra',
        category: 'dresses',
        url: testUrl,
        collectionId: collectionId,
        tags: ['#silk', '#summer', '#floral'],
        notes: 'Check size chart before ordering.'
      }
    });
    assert(saveProd.status === 201 && saveProd.data.product.id, 'Alice saves a product with tags and notes');
    const productId = saveProd.data.product.id;

    // 6. Smart Duplicate Detection
    const duplicateSave = await request('/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${aliceToken}` },
      body: {
        title: 'Floral Silk Slip Dress Duplicate',
        url: testUrl, // same normalized URL
        price: 899
      }
    });
    assert(duplicateSave.data.isDuplicate === true, 'Smart duplicate detection flags identical product URL');

    // 7. Price Tracking & History Logging
    const updatePrice = await request(`/products/${productId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${aliceToken}` },
      body: { price: 599 } // Price dropped from 899 to 599!
    });
    assert(
      updatePrice.status === 200 &&
      updatePrice.data.product.price === 599 &&
      updatePrice.data.product.priceHistory.length >= 2,
      'Price update automatically appends to PriceHistory timeline'
    );

    // 8. Public Collection Endpoint (no auth needed)
    const publicCol = await request(`/public/collections/${shareId}`);
    assert(
      publicCol.status === 200 &&
      publicCol.data.collection.products.length === 1 &&
      publicCol.data.collection.ownerName === 'Alice Walker',
      'Public collection is accessible without login and displays owner attribution & items'
    );

    // 9. User Isolation: Register Bob and verify Bob cannot see Alice's items
    const bobEmail = `bob_${Date.now()}@test.com`;
    const regBob = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Bob Smith', email: bobEmail, password: 'password123' }
    });
    const bobToken = regBob.data.token;

    const bobProducts = await request('/products', {
      headers: { Authorization: `Bearer ${bobToken}` }
    });
    assert(
      bobProducts.status === 200 && bobProducts.data.products.length === 0,
      'Strict User Isolation: Bob has 0 items and cannot see Alice private products'
    );

    const bobAccessAliceCol = await request(`/collections/${collectionId}`, {
      headers: { Authorization: `Bearer ${bobToken}` }
    });
    assert(bobAccessAliceCol.status === 403, 'Strict User Isolation: Bob is blocked from private access to Alice collection');

    // 10. Admin Access: Login as admin and fetch analytics
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@glowwear.com', password: 'admin123' }
    });
    assert(adminLogin.status === 200 && adminLogin.data.user.role === 'ADMIN', 'Admin logs in with role ADMIN');
    const adminToken = adminLogin.data.token;

    const adminAnalytics = await request('/admin/analytics', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(
      adminAnalytics.status === 200 && adminAnalytics.data.analytics.totalUsers >= 2,
      'Admin successfully fetches platform analytics with user & platform distributions'
    );

    // 11. URL Metadata Extraction Endpoint
    const scrapeTest = await request('/scrape/extract', {
      method: 'POST',
      headers: { Authorization: `Bearer ${aliceToken}` },
      body: { url: 'https://www.myntra.com/dresses/test-dress-link' }
    });
    assert(
      scrapeTest.status === 200 && scrapeTest.data.extracted.platform === 'Myntra',
      'URL extractor auto-detects platform and handles extraction gracefully'
    );

    // 12. Password Reset Flow
    const forgotRes = await request('/auth/forgot-password', {
      method: 'POST',
      body: { email: aliceEmail }
    });
    assert(
      forgotRes.status === 200 && forgotRes.data.resetToken && forgotRes.data.resetToken.length > 10,
      'Forgot password generates a valid recovery token'
    );

    const resetRes = await request('/auth/reset-password', {
      method: 'POST',
      body: {
        email: aliceEmail,
        newPassword: 'brandNewPassword123'
      }
    });
    assert(
      resetRes.status === 200 && resetRes.data.success === true,
      'Direct password reset succeeds with email and new password'
    );

    const newLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: aliceEmail,
        password: 'brandNewPassword123'
      }
    });
    assert(
      newLoginRes.status === 200 && newLoginRes.data.token,
      'User can successfully log in with their newly reset password'
    );

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    console.log(`\n================================`);
    console.log(`Total tests: ${passed + failed}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`================================\n`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
