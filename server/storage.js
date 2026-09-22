const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed platforms
const DEFAULT_PLATFORMS = [
  { id: 'myntra', name: 'Myntra', domain: 'myntra.com', color: '#FF3F6C', active: true },
  { id: 'flipkart', name: 'Flipkart', domain: 'flipkart.com', color: '#2874F0', active: true },
  { id: 'amazon', name: 'Amazon', domain: 'amazon.in', color: '#FF9900', active: true },
  { id: 'ajio', name: 'AJIO', domain: 'ajio.com', color: '#DB1F26', active: true },
  { id: 'meesho', name: 'Meesho', domain: 'meesho.com', color: '#F43397', active: true },
  { id: 'nykaa', name: 'Nykaa', domain: 'nykaa.com', color: '#FC2779', active: true },
  { id: 'other', name: 'Other Store', domain: '', color: '#c9a84c', active: true }
];

let inMemoryDb = null;
let saveLock = Promise.resolve();

async function initDb() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    inMemoryDb = JSON.parse(raw);
  } catch (err) {
    // Initialize blank DB with seed admin and demo user
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const demoPasswordHash = await bcrypt.hash('password123', 10);
    
    const adminUser = {
      id: 'usr_admin',
      name: 'GlowWear Admin',
      email: 'admin@glowwear.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatar: '',
      createdAt: new Date().toISOString()
    };

    const demoUser = {
      id: 'usr_divya',
      name: 'Divya Swain',
      email: 'divya@glowwear.com',
      passwordHash: demoPasswordHash,
      role: 'USER',
      avatar: '',
      createdAt: new Date().toISOString()
    };

    const sampleCollections = [
      {
        id: 'col_dresses',
        userId: 'usr_divya',
        title: 'Dream Dresses',
        description: 'Chic midi, party, and casual dresses for all occasions',
        emoji: '👗',
        isPublic: true,
        shareId: 'dream-dresses-divya',
        createdAt: new Date().toISOString()
      },
      {
        id: 'col_shoes',
        userId: 'usr_divya',
        title: 'Shoe Obsession',
        description: 'Sneakers, strappy heels, and everyday flats',
        emoji: '👠',
        isPublic: true,
        shareId: 'shoe-obsession-divya',
        createdAt: new Date().toISOString()
      },
      {
        id: 'col_wedding',
        userId: 'usr_divya',
        title: 'Wedding & Ethnic Inspiration',
        description: 'Jhumkas, lehengas, and silk sarees for upcoming festivities',
        emoji: '✨',
        isPublic: false,
        shareId: 'wedding-inspo-' + crypto.randomBytes(4).toString('hex'),
        createdAt: new Date().toISOString()
      }
    ];

    const sampleProducts = [
      {
        id: 'prd_1',
        userId: 'usr_divya',
        title: 'Floral Print A-Line Midi Dress',
        type: 'Casual Wear',
        category: 'dresses',
        price: 576,
        originalPrice: 1999,
        platform: 'Myntra',
        url: 'https://www.myntra.com/dresses/rilake/rilake-floral-print-a-line-midi-dress/38654042/buy',
        imageUrl: 'https://i.postimg.cc/nrsHTH2d/id1.png',
        stars: 4.1,
        reviews: 193,
        collectionId: 'col_dresses',
        isWishlisted: true,
        status: 'saved',
        tags: ['#floral', '#midi', '#casual', '#summer'],
        notes: 'Looks perfect for weekend brunch. Check if size S fits.',
        priceHistory: [
          { price: 1999, date: '2026-01-10T10:00:00.000Z' },
          { price: 799, date: '2026-02-01T10:00:00.000Z' },
          { price: 576, date: new Date().toISOString() }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prd_2',
        userId: 'usr_divya',
        title: 'Black Cut-Out Detailed Denim A-Line Dress',
        type: 'Party Wear',
        category: 'dresses',
        price: 593,
        originalPrice: 2199,
        platform: 'Myntra',
        url: 'https://www.myntra.com/dresses/sassafras/sassafras-black-cut-out-detailed-denim-a-line-dress/26219882/buy',
        imageUrl: 'https://i.postimg.cc/k51GyhCk/id2.png',
        stars: 4.4,
        reviews: 4800,
        collectionId: 'col_dresses',
        isWishlisted: true,
        status: 'to-buy',
        tags: ['#black', '#partywear', '#denim'],
        notes: 'Wait for the next Payday sale.',
        priceHistory: [
          { price: 2199, date: '2026-01-15T10:00:00.000Z' },
          { price: 593, date: new Date().toISOString() }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prd_3',
        userId: 'usr_divya',
        title: 'Blanccy Colorblack Flat Sneaker',
        type: 'Sneakers',
        category: 'shoes',
        price: 363,
        originalPrice: 999,
        platform: 'Flipkart',
        url: 'https://www.flipkart.com/blanccy-colorblack-flat-sneakers/p/itm87ed8af94d6ab',
        imageUrl: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/g/k/r/7-033-7-blanccy-white-original-imahnu8matcpgs2x.jpeg?q=90',
        stars: 4.0,
        reviews: 2765,
        collectionId: 'col_shoes',
        isWishlisted: true,
        status: 'purchased',
        tags: ['#sneakers', '#white', '#college', '#under500'],
        notes: 'Arrived! Fits true to size and super comfy.',
        priceHistory: [
          { price: 999, date: '2026-02-10T10:00:00.000Z' },
          { price: 499, date: '2026-02-20T10:00:00.000Z' },
          { price: 363, date: new Date().toISOString() }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prd_4',
        userId: 'usr_divya',
        title: 'Multi-Strap Chunky Heeled Sandals',
        type: 'Heels',
        category: 'shoes',
        price: 374,
        originalPrice: 936,
        platform: 'AJIO',
        url: 'https://www.ajio.com/haute--spicy-multi-strap-chunky-heeled-sandals/p/441310217_white',
        imageUrl: 'https://assets-jiocdn.ajio.com/medias/sys_master/root/20230505/hrJh/6454ee02d55b7d0c63975d0c/-473Wx593H-441310217-white-MODEL.jpg',
        stars: 4.0,
        reviews: 267,
        collectionId: 'col_shoes',
        isWishlisted: false,
        status: 'saved',
        tags: ['#heels', '#party', '#white'],
        notes: 'Matches the white clutch bag.',
        priceHistory: [
          { price: 936, date: '2026-01-20T10:00:00.000Z' },
          { price: 374, date: new Date().toISOString() }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prd_5',
        userId: 'usr_divya',
        title: 'Oxidised Earrings Combo Pack of 4',
        type: 'Earrings',
        category: 'jewellery',
        price: 162,
        originalPrice: 249,
        platform: 'Meesho',
        url: 'https://www.meesho.com/urbanley-oxidised-earrings-combo-pack-of-4/p/6dwqt1',
        imageUrl: 'https://images.meesho.com/images/products/386159797/gtrmj_512.avif?width=512',
        stars: 4.4,
        reviews: 18,
        collectionId: 'col_wedding',
        isWishlisted: true,
        status: 'saved',
        tags: ['#jhumka', '#oxidised', '#ethnic', '#budget'],
        notes: 'Awesome gift set for friends too.',
        priceHistory: [
          { price: 249, date: '2026-02-01T10:00:00.000Z' },
          { price: 162, date: new Date().toISOString() }
        ],
        createdAt: new Date().toISOString()
      }
    ];

    inMemoryDb = {
      users: [adminUser, demoUser],
      collections: sampleCollections,
      products: sampleProducts,
      platforms: DEFAULT_PLATFORMS,
      meta: {
        version: '2.0.0',
        lastUpdated: new Date().toISOString()
      }
    };

    await persistDb();
  }
}

async function persistDb() {
  saveLock = saveLock.then(async () => {
    inMemoryDb.meta.lastUpdated = new Date().toISOString();
    const tempFile = DB_FILE + '.tmp';
    await fs.writeFile(tempFile, JSON.stringify(inMemoryDb, null, 2), 'utf-8');
    await fs.rename(tempFile, DB_FILE);
  });
  return saveLock;
}

async function getDb() {
  if (!inMemoryDb) {
    await initDb();
  }
  return inMemoryDb;
}

function normalizeUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    const parsed = new URL(rawUrl.trim());
    const searchParams = new URLSearchParams(parsed.search);
    const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'ref_', 'tag', 'gclid', 'fbclid'];
    for (const key of trackingKeys) {
      searchParams.delete(key);
    }
    parsed.search = searchParams.toString();
    return parsed.toString().replace(/\/$/, '');
  } catch (e) {
    return rawUrl.trim().replace(/\/$/, '');
  }
}

// ──────────────────────────────────────────────
// USER OPERATIONS
// ──────────────────────────────────────────────

async function findUserByEmail(email) {
  const db = await getDb();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
}

async function findUserById(id) {
  const db = await getDb();
  return db.users.find(u => u.id === id) || null;
}

async function createUser({ name, email, password, role = 'USER' }) {
  const db = await getDb();
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: 'usr_' + crypto.randomBytes(6).toString('hex'),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    role: role || 'USER',
    avatar: '',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // Auto-create a default collection for new user
  const defaultCollection = {
    id: 'col_' + crypto.randomBytes(6).toString('hex'),
    userId: newUser.id,
    title: 'My First Collection ✨',
    description: 'A cozy corner for your favorite finds',
    emoji: '🛍️',
    isPublic: false,
    shareId: 'my-finds-' + crypto.randomBytes(4).toString('hex'),
    createdAt: new Date().toISOString()
  };
  db.collections.push(defaultCollection);

  await persistDb();
  const { passwordHash: _, ...userSafe } = newUser;
  return userSafe;
}

async function updateUser(id, updates) {
  const db = await getDb();
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found.');

  const allowedFields = ['name', 'avatar'];
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      db.users[index][field] = updates[field];
    }
  }

  if (updates.newPassword) {
    db.users[index].passwordHash = await bcrypt.hash(updates.newPassword, 10);
  }

  await persistDb();
  const { passwordHash: _, ...userSafe } = db.users[index];
  return userSafe;
}

async function createPasswordResetToken(email) {
  const db = await getDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    throw new Error('No account found with this email address.');
  }

  const token = crypto.randomBytes(16).toString('hex');
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 mins
  await persistDb();
  return { token, email: user.email, name: user.name };
}

async function resetUserPassword(email, newPassword) {
  const db = await getDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    throw new Error('No account found with this email address.');
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  delete user.resetToken;
  delete user.resetTokenExpires;
  await persistDb();
  return { success: true, message: 'Password reset successfully!' };
}

async function resetPasswordWithToken(email, token, newPassword) {
  const db = await getDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    throw new Error('No account found with this email address.');
  }

  if (token) {
    if (!user.resetToken || user.resetToken !== token) {
      throw new Error('Invalid or expired reset token.');
    }
    if (Date.now() > user.resetTokenExpires) {
      throw new Error('Reset token has expired. Please request a new one.');
    }
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  delete user.resetToken;
  delete user.resetTokenExpires;
  await persistDb();
  return { success: true, message: 'Password reset successfully!' };
}

async function getAllUsers() {
  const db = await getDb();
  return db.users.map(({ passwordHash, ...safeUser }) => {
    const userProductsCount = db.products.filter(p => p.userId === safeUser.id).length;
    const userCollectionsCount = db.collections.filter(c => c.userId === safeUser.id).length;
    return {
      ...safeUser,
      productsCount: userProductsCount,
      collectionsCount: userCollectionsCount
    };
  });
}

// ──────────────────────────────────────────────
// COLLECTION OPERATIONS
// ──────────────────────────────────────────────

async function getCollectionsByUser(userId) {
  const db = await getDb();
  const userCollections = db.collections.filter(c => c.userId === userId);
  return userCollections.map(col => {
    const colProducts = db.products.filter(p => p.collectionId === col.id && p.userId === userId);
    return {
      ...col,
      itemCount: colProducts.length,
      estimatedValue: colProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0),
      previewImages: colProducts.slice(0, 4).map(p => p.imageUrl).filter(Boolean)
    };
  });
}

async function getCollectionById(colId, userId) {
  const db = await getDb();
  const col = db.collections.find(c => c.id === colId);
  if (!col) return null;
  if (col.userId !== userId) throw new Error('Unauthorized access to collection.');
  return col;
}

async function getCollectionByShareId(shareId) {
  const db = await getDb();
  const col = db.collections.find(c => c.shareId === shareId);
  if (!col) return null;
  if (!col.isPublic) throw new Error('This collection is private.');
  
  const owner = db.users.find(u => u.id === col.userId);
  const products = db.products.filter(p => p.collectionId === col.id && p.userId === col.userId);

  return {
    ...col,
    ownerName: owner ? owner.name : 'A GlowWear Shopper',
    itemCount: products.length,
    estimatedValue: products.reduce((sum, p) => sum + (Number(p.price) || 0), 0),
    products
  };
}

async function createCollection(userId, { title, description = '', emoji = '🛍️', isPublic = false }) {
  const db = await getDb();
  const newCol = {
    id: 'col_' + crypto.randomBytes(6).toString('hex'),
    userId,
    title: title.trim(),
    description: description.trim(),
    emoji: emoji || '🛍️',
    isPublic: Boolean(isPublic),
    shareId: (title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20) || 'collection') + '-' + crypto.randomBytes(3).toString('hex'),
    createdAt: new Date().toISOString()
  };
  db.collections.push(newCol);
  await persistDb();
  return newCol;
}

async function updateCollection(colId, userId, updates) {
  const db = await getDb();
  const col = db.collections.find(c => c.id === colId);
  if (!col) throw new Error('Collection not found.');
  if (col.userId !== userId) throw new Error('Unauthorized: You do not own this collection.');

  if (updates.title !== undefined) col.title = updates.title.trim();
  if (updates.description !== undefined) col.description = updates.description.trim();
  if (updates.emoji !== undefined) col.emoji = updates.emoji;
  if (updates.isPublic !== undefined) col.isPublic = Boolean(updates.isPublic);

  await persistDb();
  return col;
}

async function deleteCollection(colId, userId) {
  const db = await getDb();
  const index = db.collections.findIndex(c => c.id === colId);
  if (index === -1) throw new Error('Collection not found.');
  if (db.collections[index].userId !== userId) throw new Error('Unauthorized: You do not own this collection.');

  db.collections.splice(index, 1);
  db.products.forEach(p => {
    if (p.collectionId === colId && p.userId === userId) {
      p.collectionId = null;
    }
  });

  await persistDb();
  return { success: true, message: 'Collection deleted successfully.' };
}

// ──────────────────────────────────────────────
// PRODUCT OPERATIONS
// ──────────────────────────────────────────────

async function getProductsByUser(userId, filters = {}) {
  const db = await getDb();
  let items = db.products.filter(p => p.userId === userId);

  if (filters.collectionId) {
    items = items.filter(p => p.collectionId === filters.collectionId);
  }

  if (filters.isWishlisted !== undefined) {
    items = items.filter(p => p.isWishlisted === (filters.isWishlisted === 'true' || filters.isWishlisted === true));
  }

  if (filters.status) {
    items = items.filter(p => p.status === filters.status);
  }

  if (filters.platform) {
    items = items.filter(p => p.platform && p.platform.toLowerCase() === filters.platform.toLowerCase());
  }

  if (filters.category) {
    items = items.filter(p => p.category && p.category.toLowerCase() === filters.category.toLowerCase());
  }

  if (filters.tag) {
    const searchTag = filters.tag.startsWith('#') ? filters.tag.toLowerCase() : '#' + filters.tag.toLowerCase();
    items = items.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === searchTag));
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.platform && p.platform.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.notes && p.notes.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  if (filters.sort) {
    switch (filters.sort) {
      case 'oldest':
        items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price_low':
        items.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_high':
        items.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'discount':
        items.sort((a, b) => {
          const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discB - discA;
        });
        break;
      case 'newest':
      default:
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
  } else {
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return items;
}

async function findProductByUrl(userId, url) {
  const db = await getDb();
  const normalized = normalizeUrl(url);
  return db.products.find(p => p.userId === userId && normalizeUrl(p.url) === normalized) || null;
}

async function createProduct(userId, productData) {
  const db = await getDb();
  const normalizedUrl = normalizeUrl(productData.url);

  if (normalizedUrl) {
    const existing = db.products.find(p => p.userId === userId && normalizeUrl(p.url) === normalizedUrl);
    if (existing) {
      return {
        isDuplicate: true,
        existingProduct: existing,
        message: 'You already saved this product ❤️'
      };
    }
  }

  const parsedPrice = Number(productData.price) || 0;
  const parsedOriginalPrice = Number(productData.originalPrice) || parsedPrice;

  const newProduct = {
    id: 'prd_' + crypto.randomBytes(6).toString('hex'),
    userId,
    title: (productData.title || 'Saved Product').trim(),
    type: productData.type || 'Fashion Item',
    category: (productData.category || 'dresses').toLowerCase(),
    price: parsedPrice,
    originalPrice: parsedOriginalPrice,
    platform: productData.platform || 'Other',
    url: productData.url ? productData.url.trim() : '',
    imageUrl: productData.imageUrl || '',
    stars: Number(productData.stars) || 4.5,
    reviews: Number(productData.reviews) || 1,
    collectionId: productData.collectionId || null,
    isWishlisted: productData.isWishlisted !== undefined ? Boolean(productData.isWishlisted) : true,
    status: productData.status || 'saved',
    tags: Array.isArray(productData.tags) ? productData.tags.map(t => t.startsWith('#') ? t : '#' + t) : [],
    notes: productData.notes || '',
    priceHistory: [
      { price: parsedPrice, date: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  await persistDb();
  return { isDuplicate: false, product: newProduct };
}

async function updateProduct(productId, userId, updates) {
  const db = await getDb();
  const product = db.products.find(p => p.id === productId);
  if (!product) throw new Error('Product not found.');
  if (product.userId !== userId) throw new Error('Unauthorized: You do not own this product.');

  const editableFields = ['title', 'category', 'type', 'platform', 'url', 'imageUrl', 'collectionId', 'isWishlisted', 'status', 'tags', 'notes'];
  editableFields.forEach(field => {
    if (updates[field] !== undefined) {
      product[field] = updates[field];
    }
  });

  if (updates.price !== undefined) {
    const newPrice = Number(updates.price);
    if (!isNaN(newPrice) && newPrice !== product.price) {
      product.priceHistory = product.priceHistory || [];
      product.priceHistory.push({
        price: newPrice,
        date: new Date().toISOString()
      });
      product.price = newPrice;
    }
  }

  if (updates.originalPrice !== undefined) {
    product.originalPrice = Number(updates.originalPrice);
  }

  await persistDb();
  return product;
}

async function deleteProduct(productId, userId) {
  const db = await getDb();
  const index = db.products.findIndex(p => p.id === productId);
  if (index === -1) throw new Error('Product not found.');
  if (db.products[index].userId !== userId) throw new Error('Unauthorized: You do not own this product.');

  db.products.splice(index, 1);
  await persistDb();
  return { success: true, message: 'Product deleted.' };
}

// ──────────────────────────────────────────────
// DASHBOARD & ANALYTICS METRICS
// ──────────────────────────────────────────────

async function getUserDashboardMetrics(userId) {
  const db = await getDb();
  const userProducts = db.products.filter(p => p.userId === userId);
  const userCollections = db.collections.filter(c => c.userId === userId);
  const wishlistItems = userProducts.filter(p => p.isWishlisted);

  const totalWishlistValue = wishlistItems.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
  const totalSavedValue = userProducts.reduce((acc, p) => acc + (Number(p.price) || 0), 0);

  let priceDropCount = 0;
  const priceDropItems = [];

  userProducts.forEach(p => {
    if (p.priceHistory && p.priceHistory.length > 1) {
      const firstPrice = p.priceHistory[0].price;
      const currentPrice = p.price;
      if (currentPrice < firstPrice) {
        priceDropCount++;
        priceDropItems.push({
          product: p,
          dropAmount: firstPrice - currentPrice,
          percentage: Math.round(((firstPrice - currentPrice) / firstPrice) * 100)
        });
      }
    }
  });

  const tagSet = new Set();
  userProducts.forEach(p => {
    if (Array.isArray(p.tags)) {
      p.tags.forEach(t => tagSet.add(t));
    }
  });

  return {
    totalProducts: userProducts.length,
    totalCollections: userCollections.length,
    totalWishlist: wishlistItems.length,
    totalWishlistValue,
    totalSavedValue,
    priceDropCount,
    priceDropItems,
    statusCounts: {
      saved: userProducts.filter(p => p.status === 'saved').length,
      toBuy: userProducts.filter(p => p.status === 'to-buy').length,
      purchased: userProducts.filter(p => p.status === 'purchased').length
    },
    userTags: Array.from(tagSet),
    recentProducts: userProducts.slice(0, 6)
  };
}

async function getAdminAnalytics() {
  const db = await getDb();
  const totalUsers = db.users.length;
  const totalProducts = db.products.length;
  const totalCollections = db.collections.length;
  const publicCollections = db.collections.filter(c => c.isPublic).length;

  const platformCounts = {};
  db.products.forEach(p => {
    const plat = p.platform || 'Other';
    platformCounts[plat] = (platformCounts[plat] || 0) + 1;
  });

  const categoryCounts = {};
  db.products.forEach(p => {
    const cat = p.category || 'other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  return {
    totalUsers,
    totalProducts,
    totalCollections,
    publicCollections,
    platformCounts,
    categoryCounts,
    platforms: db.platforms || DEFAULT_PLATFORMS,
    recentUsers: db.users.slice(-10).map(({ passwordHash, ...u }) => u)
  };
}

module.exports = {
  initDb,
  normalizeUrl,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  createPasswordResetToken,
  resetPasswordWithToken,
  resetUserPassword,
  getAllUsers,
  getCollectionsByUser,
  getCollectionById,
  getCollectionByShareId,
  createCollection,
  updateCollection,
  deleteCollection,
  getProductsByUser,
  findProductByUrl,
  createProduct,
  updateProduct,
  deleteProduct,
  getUserDashboardMetrics,
  getAdminAnalytics
};
