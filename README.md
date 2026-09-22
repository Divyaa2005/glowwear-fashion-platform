# 🌟 GlowWear 2.0 — Universal Shopping Wishlist & Collection Platform

> **Save it. Organize it. Shop it.**  
> GlowWear is a universal shopping organizer that enables users to save fashion and lifestyle finds from any e-commerce platform (Myntra, Flipkart, Amazon, AJIO, Meesho, Nykaa, and more) into **one personal account**, curate custom lookbooks/collections, track price drops, and share wishlists.

---

## 🚀 Core Features in GlowWear 2.0

### 1. ⚡ Universal Product Saver (`+ Save Product`)
- Paste any product URL from Myntra, Flipkart, Amazon, AJIO, Meesho, Nykaa, or any online store.
- Automatic metadata extraction (OpenGraph tags, JSON-LD, microdata) for title, price, MRP, platform, image, and category.
- **Graceful Manual Fallback:** If an external store blocks automated scrapers, a manual entry drawer opens pre-populated with whatever details were detected.
- **Smart Duplicate Detection:** Alerts if a product URL is already saved in your account and prevents unwanted duplicates.

### 2. 📁 Thematic Collection Manager
- Create unlimited personal collections (e.g., *Dream Dresses*, *Wedding Inspo*, *College Outfits*, *Under ₹1500*).
- Custom icon/emoji selector, description, and cover previews.
- **Public & Shareable Collections:** Toggle any collection to public to generate a unique shareable URL (`/c/:shareId`) that friends can view in read-only mode without logging in.

### 3. 📉 Live Price Tracking & History Timeline
- Automatic price change detection whenever a product's price is updated.
- Visual SVG price history step-chart showing initial price, previous price, and current price.
- **Price Drop Badge & Filter:** Highlights products that dropped in price (`🎉 ₹500 Price Drop`).

### 4. 🏷️ Custom Tags & Personal Notes
- Add custom tags (`#partywear`, `#black`, `#summer`, `#budget`).
- Instant tag filtering across your entire wardrobe.
- Private personal notes (e.g., *"Size M fits best"*, *"Wait for festive sale"*, *"Gift for sister"*).

### 5. 🛍️ Shopping Status Pipeline
- Organize saved items through three shopping states:
  - 💖 **Saved**
  - 🛍️ **Planning to Buy (To Buy)**
  - ✅ **Purchased**
- One-click status updates directly from the product card.

### 6. 🔐 Robust JWT Authentication & Strict User Isolation
- Secure user registration, login, profile management, and password updates.
- Passwords securely hashed with `bcryptjs`.
- Strict user ownership validation on every backend route — User A can never inspect or alter User B's private items or collections.

### 7. 📊 Admin Analytics & Platform Management
- Live platform metrics: Total Registered Users, Total Saved Items, Total Collections.
- Ingestion breakdown by shopping platform (Myntra, Flipkart, Amazon, AJIO, etc.) and category.
- User management directory and platform configuration.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 19, React Router v7, Context API, CSS Modules / Style Objects |
| **Backend API** | Node.js, Express 5, CORS, Dotenv |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing |
| **Scraper / Metadata** | `cheerio`, native `fetch` with User-Agent spoofing and timeout protection |
| **Database** | Dual-Mode: High-performance atomic JSON file database (local zero-config) + MongoDB Atlas support via `MONGODB_URI` |
| **Deployment** | Vercel Serverless Function (`api/index.js`, `vercel.json`) |

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js v18+ (tested on Node.js v22.19.0)
- npm v9+

### 2. Installation
```bash
# Navigate to project directory
cd mini-fashion

# Install dependencies
npm install
```

### 3. Run Locally (Frontend + Backend Concurrently)
```bash
npm run dev
```
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5001](http://localhost:5001)
- **API Health Check:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

### 4. Default Seed Accounts
For instant testing right after cloning:

| Role | Email | Password |
| :--- | :--- | :--- |
| **User (Demo)** | `divya@glowwear.com` | `password123` |
| **Admin** | `admin@glowwear.com` | `admin123` |

---

## 🧪 Running Automated Verification Tests
```bash
node server/test-api.js
```
Runs 13 end-to-end test assertions verifying authentication, user isolation, collections, product saving, duplicate detection, price tracking, public shared collections, and admin access.

---

## 🚢 Vercel Deployment

This project is configured for direct deployment on Vercel:
1. Connect your repository to Vercel.
2. Root directory: `mini-fashion`
3. Build command: `npm run build`
4. Output directory: `build`
5. Set Environment Variables on Vercel:
   - `JWT_SECRET`: A long random secret string.
   - `MONGODB_URI` *(Optional)*: If you want persistent cloud storage across cold starts on Vercel lambdas, connect a free MongoDB Atlas cluster URI.

---

## 👩‍💻 Author
**Dibyasanti Swain**  
*GlowWear — Your Personal Shopping Universe*
