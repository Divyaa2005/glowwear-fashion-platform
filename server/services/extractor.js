const cheerio = require('cheerio');

// Detect platform from URL hostname
function detectPlatform(urlString) {
  try {
    const parsed = new URL(urlString);
    const host = parsed.hostname.toLowerCase();
    if (host.includes('myntra.com')) return 'Myntra';
    if (host.includes('flipkart.com')) return 'Flipkart';
    if (host.includes('amazon.')) return 'Amazon';
    if (host.includes('ajio.com')) return 'AJIO';
    if (host.includes('meesho.com')) return 'Meesho';
    if (host.includes('nykaa.')) return 'Nykaa';
    if (host.includes('zara.com')) return 'Zara';
    if (host.includes('hm.com')) return 'H&M';
    if (host.includes('urbanic.com')) return 'Urbanic';
    
    // Extract base domain as clean name
    const parts = host.replace(/^www\./, '').split('.');
    if (parts.length >= 2) {
      const name = parts[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return 'Other';
  } catch (e) {
    return 'Other';
  }
}

// Detect category from URL tokens or title
function detectCategory(urlString, text = '') {
  const combined = (urlString + ' ' + text).toLowerCase();
  if (combined.includes('dress') || combined.includes('gown') || combined.includes('frock')) return 'dresses';
  if (combined.includes('shoe') || combined.includes('sneaker') || combined.includes('heel') || combined.includes('sandal') || combined.includes('flat') || combined.includes('boot')) return 'shoes';
  if (combined.includes('makeup') || combined.includes('lipstick') || combined.includes('kajal') || combined.includes('foundation') || combined.includes('eyeliner') || combined.includes('mascara') || combined.includes('blush')) return 'makeup';
  if (combined.includes('bag') || combined.includes('tote') || combined.includes('clutch') || combined.includes('purse') || combined.includes('backpack') || combined.includes('handbag')) return 'bags';
  if (combined.includes('jewel') || combined.includes('earring') || combined.includes('necklace') || combined.includes('jhumka') || combined.includes('ring') || combined.includes('pendant') || combined.includes('bracelet')) return 'jewellery';
  if (combined.includes('saree') || combined.includes('salwar') || combined.includes('kurta') || combined.includes('lehenga') || combined.includes('ethnic') || combined.includes('anarkali')) return 'ethnic';
  if (combined.includes('top') || combined.includes('tshirt') || combined.includes('shirt') || combined.includes('blouse') || combined.includes('t-shirt') || combined.includes('crop')) return 'tops';
  return 'dresses';
}

// Parse price from string
function parsePrice(text) {
  if (!text) return null;
  // match patterns like ₹1,499 or Rs. 1499 or INR 1499 or 1499.00
  const clean = text.toString().replace(/[,\s]/g, '');
  const match = clean.match(/(?:₹|rs\.?|inr)?(\d+(?:\.\d{1,2})?)/i);
  if (match && match[1]) {
    const num = Math.round(parseFloat(match[1]));
    return isNaN(num) || num <= 0 ? null : num;
  }
  return null;
}

async function extractMetadata(rawUrl) {
  let url = rawUrl ? rawUrl.trim() : '';
  if (!url) {
    throw new Error('Please provide a valid product URL.');
  }

  // Ensure http / https
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  const platform = detectPlatform(url);
  let category = detectCategory(url);

  let extracted = {
    title: '',
    price: null,
    originalPrice: null,
    imageUrl: '',
    platform,
    category,
    url
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      // If blocked by Cloudflare / anti-bot, return partial info with manual entry trigger
      return {
        success: true,
        needsManualInput: true,
        message: `Couldn't auto-fetch from ${platform}. Please confirm or enter details below.`,
        extracted
      };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 1. Title Extraction
    const ogTitle = $('meta[property="og:title"]').attr('content') ||
                    $('meta[name="twitter:title"]').attr('content') ||
                    $('title').text() ||
                    $('h1').first().text();

    if (ogTitle) {
      extracted.title = ogTitle.split('|')[0].split('-')[0].trim();
    }

    // 2. Image Extraction
    const ogImage = $('meta[property="og:image"]').attr('content') ||
                    $('meta[property="og:image:secure_url"]').attr('content') ||
                    $('meta[name="twitter:image"]').attr('content') ||
                    $('link[rel="image_src"]').attr('href');

    if (ogImage) {
      extracted.imageUrl = ogImage.startsWith('//') ? 'https:' + ogImage : ogImage;
    }

    // 3. Price Extraction
    // Check JSON-LD
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html());
        const parseJsonLdProduct = (item) => {
          if (!item) return;
          if (item['@type'] === 'Product' || (Array.isArray(item['@type']) && item['@type'].includes('Product'))) {
            if (!extracted.title && item.name) extracted.title = item.name;
            if (!extracted.imageUrl && item.image) {
              extracted.imageUrl = Array.isArray(item.image) ? item.image[0] : (item.image.url || item.image);
            }
            if (item.offers) {
              const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
              if (offers && offers.price) {
                extracted.price = parsePrice(offers.price);
              }
            }
          }
        };

        if (Array.isArray(json)) {
          json.forEach(parseJsonLdProduct);
        } else {
          parseJsonLdProduct(json);
          if (json['@graph'] && Array.isArray(json['@graph'])) {
            json['@graph'].forEach(parseJsonLdProduct);
          }
        }
      } catch (err) {
        // ignore json parse errors
      }
    });

    // Check OpenGraph / meta prices
    if (!extracted.price) {
      const metaPrice = $('meta[property="og:price:amount"]').attr('content') ||
                        $('meta[property="product:price:amount"]').attr('content') ||
                        $('meta[name="twitter:data1"]').attr('content');
      if (metaPrice) {
        extracted.price = parsePrice(metaPrice);
      }
    }

    // Refine category if we have title
    if (extracted.title) {
      extracted.category = detectCategory(url, extracted.title);
    }

    const hasEssentialData = Boolean(extracted.title && extracted.imageUrl && extracted.price);

    return {
      success: true,
      needsManualInput: !hasEssentialData,
      message: hasEssentialData
        ? `Successfully fetched product details from ${platform}! ✨`
        : `Fetched partial details from ${platform}. Please complete any missing fields.`,
      extracted
    };

  } catch (err) {
    // Graceful fallback on network timeout or fetch error
    return {
      success: true,
      needsManualInput: true,
      message: `Automatic extraction unavailable for this link. You can enter the details manually.`,
      extracted
    };
  }
}

module.exports = {
  detectPlatform,
  detectCategory,
  extractMetadata
};
