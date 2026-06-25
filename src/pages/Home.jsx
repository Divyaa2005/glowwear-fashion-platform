import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import products from '../data/products';

const categories = [
  { id: 'dresses', emoji: '👗', label: 'Dresses', sub: 'Formal · Party · Casual' },
  { id: 'shoes', emoji: '👠', label: 'Shoes', sub: 'Heels · Flats · Sneakers' },
  { id: 'makeup', emoji: '💄', label: 'Makeup', sub: 'Lips · Eyes · Face' },
  { id: 'bags', emoji: '👜', label: 'Bags', sub: 'Totes · Clutches · Backpacks' },
  { id: 'jewellery', emoji: '💍', label: 'Jewellery', sub: 'Earrings · Necklaces · Sets' },
  { id: 'ethnic', emoji: '🥻', label: 'Ethnic', sub: 'Sarees · Salwars · Lehengas' },
  { id: 'tops', emoji: '👚', label: 'Tops', sub: 'Kurtis · Crop Tops · Western' },
];

const stores = [
  { name: 'Myntra', url: 'https://www.myntra.com', bg: '#FF3F6C', logo: 'https://constant.myntassets.com/web/assets/img/icon_myntra.png' },
  { name: 'Flipkart', url: 'https://www.flipkart.com', bg: '#2874F0', logo: 'https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkl_icon-eeab9.png' },
  { name: 'Amazon', url: 'https://www.amazon.in/s?k=women+fashion', bg: '#FF9900', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'Ajio', url: 'https://www.ajio.com', bg: '#DB1F26', logo: 'https://assets.ajio.com/static/img/Ajio_Logo.svg' },
  { name: 'Meesho', url: 'https://www.meesho.com', bg: '#F43397', logo: 'https://images.meesho.com/images/marketing/1563353555.jpg' },
  { name: 'Nykaa', url: 'https://www.nykaafashion.com', bg: '#FC2779', logo: 'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/favicons/nykaa-favicon.png' },
];

const StoreIcon = ({ store, size = 52 }) => (
  <a
    href={store.url}
    target="_blank"
    rel="noreferrer"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.4rem',
      textDecoration: 'none',
    }}
  >
    <div style={{
      width: size + 'px',
      height: size + 'px',
      borderRadius: '14px',
      background: store.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    }}>
      <img
        src={store.logo}
        alt={store.name}
        style={{ width: (size - 16) + 'px', height: (size - 16) + 'px', objectFit: 'contain' }}
        onError={e => {
          e.target.style.display = 'none';
          e.target.parentNode.innerHTML = `<span style="color:white;font-size:0.6rem;font-weight:700;text-align:center;padding:2px">${store.name}</span>`;
        }}
      />
    </div>
    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', fontWeight: 500 }}>
      {store.name}
    </span>
  </a>
);

const Home = () => {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? products
    : filter === 'under499'
    ? products.filter(p => p.price < 499)
    : filter === 'under999'
    ? products.filter(p => p.price < 999)
    : products.filter(p => p.category === filter);

  return (
    <div style={styles.page}>

      {/* ── HERO ── */}
      <section style={styles.hero}>
        <div style={styles.orb1}></div>
        <div style={styles.orb2}></div>
        <div style={styles.heroInner}>
          <div style={styles.eyebrow}>✦ New Collection 2026</div>
          <h1 style={styles.heroTitle}>
            Dress to{' '}
            <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Impress,</em>
            <br />Not Overspend
          </h1>
          <p style={styles.heroDesc}>
            Handpicked women's fashion from Myntra, Flipkart & more —
            trending styles at prices that actually make sense.
          </p>
          <div style={styles.heroBtns}>
            <a href="#deals" style={styles.btnGold}>Shop Deals →</a>
            <Link to="/category/dresses" style={styles.btnGhost}>Explore Dresses</Link>
          </div>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statNum}>500+</div>
              <div style={styles.statLabel}>Curated Items</div>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.stat}>
              <div style={styles.statNum}>₹99</div>
              <div style={styles.statLabel}>Starts From</div>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.stat}>
              <div style={styles.statNum}>60%</div>
              <div style={styles.statLabel}>Avg Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={styles.marqueeStrip}>
        <div style={styles.marqueeTrack}>
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span style={styles.marqueeItem}>✦ Dresses from ₹299</span>
              <span style={styles.marqueeDot}>·</span>
              <span style={styles.marqueeItem}>✦ Shoes from ₹399</span>
              <span style={styles.marqueeDot}>·</span>
              <span style={styles.marqueeItem}>✦ Makeup from ₹99</span>
              <span style={styles.marqueeDot}>·</span>
              <span style={styles.marqueeItem}>✦ Up to 70% OFF</span>
              <span style={styles.marqueeDot}>·</span>
              <span style={styles.marqueeItem}>✦ Myntra · Flipkart · Meesho · Ajio</span>
              <span style={styles.marqueeDot}>·</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section style={styles.section}>
        <div style={styles.sectionEyebrow}>Browse</div>
        <h2 style={styles.sectionTitle}>
          Shop by{' '}
          <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Category</em>
        </h2>
        <div style={styles.catGrid}>
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.id}`} style={styles.catCard}>
              <div style={styles.catEmoji}>{cat.emoji}</div>
              <div style={styles.catLabel}>{cat.label}</div>
              <div style={styles.catSub}>{cat.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DEALS ── */}
      <section style={styles.section} id="deals">
        <div style={styles.sectionEyebrow}>Handpicked</div>
        <h2 style={styles.sectionTitle}>
          Today's{' '}
          <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Best Deals</em>
        </h2>

        <div style={styles.filters}>
          {[
            { key: 'all', label: 'All Items' },
            { key: 'under499', label: 'Under ₹499' },
            { key: 'under999', label: 'Under ₹999' },
            { key: 'dresses', label: 'Dresses' },
            { key: 'shoes', label: 'Shoes' },
            { key: 'makeup', label: 'Makeup' },
            { key: 'bags', label: 'Bags' },
            { key: 'jewellery', label: 'Jewellery' },
            { key: 'ethnic', label: 'Ethnic' },
            { key: 'tops', label: 'Tops' },
          ].map(f => (
            <button
              key={f.key}
              style={{
                ...styles.filterBtn,
                background: filter === f.key ? '#c9a84c' : 'transparent',
                color: filter === f.key ? '#0a090d' : '#8a849a',
                borderColor: filter === f.key ? '#c9a84c' : 'rgba(255,255,255,0.1)',
                fontWeight: filter === f.key ? 700 : 500,
              }}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={styles.productGrid}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section style={styles.promoBand}>
        <div>
          <div style={styles.promoTag}>✦ Limited Offer</div>
          <h3 style={styles.promoTitle}>
            First Order? Get{' '}
            <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Extra 10% Off</em>
          </h3>
          <p style={styles.promoDesc}>
            Use code <strong style={{ color: '#c9a84c' }}>GLOW10</strong> at checkout
            on Myntra. Min. order ₹599.
          </p>
        </div>

        {/* STORE ICONS */}
        <div style={styles.storeIcons}>
          {stores.map(store => (
            <StoreIcon key={store.name} store={store} size={52} />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <div style={styles.footerGrid}>
          <div>
            <div style={styles.footerLogo}>GlowWear ✦</div>
            <p style={styles.footerDesc}>
              Affordable women's fashion — handpicked from India's best online
              stores so you always look your best.
            </p>
          </div>
          <div>
            <div style={styles.footerTitle}>Categories</div>
            {categories.map(c => (
              <Link key={c.id} to={`/category/${c.id}`} style={styles.footerLink}>
                {c.label}
              </Link>
            ))}
          </div>
          <div>
  <div style={styles.footerTitle}>Shop From</div>
  <a href="https://www.myntra.com" target="_blank" rel="noreferrer" style={styles.footerLink}>Myntra ↗</a>
  <a href="https://www.flipkart.com" target="_blank" rel="noreferrer" style={styles.footerLink}>Flipkart ↗</a>
  <a href="https://www.amazon.in/s?k=women+fashion" target="_blank" rel="noreferrer" style={styles.footerLink}>Amazon ↗</a>
  <a href="https://www.ajio.com" target="_blank" rel="noreferrer" style={styles.footerLink}>Ajio ↗</a>
  <a href="https://www.meesho.com" target="_blank" rel="noreferrer" style={styles.footerLink}>Meesho ↗</a>
  <a href="https://www.nykaafashion.com" target="_blank" rel="noreferrer" style={styles.footerLink}>Nykaa ↗</a>
</div>
        </div>
        <div style={styles.footerBottom}>
          © 2026 GlowWear · Made with 💛 for smart shoppers
        </div>
      </footer>

    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a090d',
  },
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8rem 2rem 4rem',
    position: 'relative',
    overflow: 'hidden',
    background: 'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(212,96,122,0.08) 0%, transparent 60%), #0a090d',
  },
  orb1: {
    position: 'absolute', top: '-100px', left: '-100px',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,168,76,0.08), transparent 70%)',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute', bottom: '-100px', right: '-50px',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,96,122,0.1), transparent 70%)',
    pointerEvents: 'none',
  },
  heroInner: {
    maxWidth: '700px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  eyebrow: {
    fontSize: '0.72rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '1.5rem',
  },
  heroTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(3rem, 7vw, 5rem)',
    fontWeight: 300,
    lineHeight: 1.1,
    color: '#ffffff',
    marginBottom: '1.5rem',
  },
  heroDesc: {
    fontSize: '1rem',
    color: '#8a849a',
    lineHeight: 1.8,
    marginBottom: '2.5rem',
    maxWidth: '500px',
    margin: '0 auto 2.5rem',
  },
  heroBtns: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '3rem',
  },
  btnGold: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0.9rem 2.2rem',
    borderRadius: '50px',
    fontSize: '0.88rem',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    letterSpacing: '0.5px',
  },
  btnGhost: {
    background: 'transparent',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '0.9rem 2.2rem',
    borderRadius: '50px',
    fontSize: '0.88rem',
    fontWeight: 500,
    textDecoration: 'none',
  },
  stats: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    flexWrap: 'wrap',
  },
  stat: { textAlign: 'center' },
  statNum: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '2rem',
    fontWeight: 600,
    color: '#c9a84c',
  },
  statLabel: {
    fontSize: '0.72rem',
    color: '#8a849a',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginTop: '0.2rem',
  },
  statDivider: {
    width: '1px', height: '40px',
    background: 'rgba(255,255,255,0.07)',
  },
  marqueeStrip: {
    background: '#c9a84c',
    padding: '0.85rem 0',
    overflow: 'hidden',
  },
  marqueeTrack: {
    display: 'flex',
    gap: '2rem',
    animation: 'marquee 25s linear infinite',
    whiteSpace: 'nowrap',
  },
  marqueeItem: {
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#0a090d',
  },
  marqueeDot: { color: 'rgba(10,9,13,0.4)' },
  section: {
    padding: '5rem 2rem',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  sectionEyebrow: {
    fontSize: '0.7rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '0.6rem',
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
    fontWeight: 300,
    color: '#ffffff',
    marginBottom: '2.5rem',
  },
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1rem',
  },
  catCard: {
    background: '#1e1b28',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '18px',
    padding: '1.8rem 1rem',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  catEmoji: { fontSize: '2.8rem', marginBottom: '0.8rem' },
  catLabel: {
    fontWeight: 600,
    fontSize: '0.92rem',
    color: '#ffffff',
    marginBottom: '0.3rem',
  },
  catSub: { fontSize: '0.72rem', color: '#8a849a' },
  filters: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap',
    marginBottom: '2.5rem',
  },
  filterBtn: {
    padding: '0.5rem 1.3rem',
    borderRadius: '50px',
    border: '1px solid',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'Outfit', sans-serif",
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
    gap: '1.5rem',
  },
  promoBand: {
    margin: '0 2rem 4rem',
    background: 'linear-gradient(135deg, #1a0e20, #0e1020)',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '24px',
    padding: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '2rem',
  },
  promoTag: {
    fontSize: '0.7rem',
    letterSpacing: '2px',
    color: '#c9a84c',
    textTransform: 'uppercase',
    marginBottom: '0.8rem',
  },
  promoTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '2rem',
    fontWeight: 300,
    color: '#ffffff',
    marginBottom: '0.8rem',
  },
  promoDesc: {
    color: '#8a849a',
    fontSize: '0.9rem',
    lineHeight: 1.7,
  },
  storeIcons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  footer: {
    background: '#111018',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    padding: '4rem 2rem 2rem',
  },
  footerGrid: {
    maxWidth: '1300px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '3rem',
    marginBottom: '3rem',
  },
  footerLogo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.8rem',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '1rem',
  },
  footerDesc: {
    color: '#8a849a',
    fontSize: '0.85rem',
    lineHeight: 1.8,
  },
  footerTitle: {
    fontSize: '0.7rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '1.2rem',
  },
  footerLink: {
    display: 'block',
    color: '#8a849a',
    textDecoration: 'none',
    fontSize: '0.85rem',
    marginBottom: '0.7rem',
  },
  footerBottom: {
    maxWidth: '1300px',
    margin: '0 auto',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    paddingTop: '1.5rem',
    textAlign: 'center',
    color: '#8a849a',
    fontSize: '0.8rem',
  },
};

export default Home;