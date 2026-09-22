import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SaveProductModal from '../components/SaveProductModal';

const PLATFORMS = [
  { name: 'Myntra', color: '#FF3F6C', tagline: 'Fashion & Trends' },
  { name: 'Flipkart', color: '#2874F0', tagline: 'Everyday Deals' },
  { name: 'Amazon', color: '#FF9900', tagline: 'Global Catalog' },
  { name: 'AJIO', color: '#DB1F26', tagline: 'Runway Styles' },
  { name: 'Meesho', color: '#F43397', tagline: 'Budget Finds' },
  { name: 'Nykaa', color: '#FC2779', tagline: 'Beauty & Glam' }
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleStartSaving = () => {
    if (user) {
      setShowSaveModal(true);
    } else {
      navigate('/signup');
    }
  };

  return (
    <div style={styles.page}>
      
      {/* ── HERO SECTION ── */}
      <section style={styles.hero}>
        <div style={styles.glowOrb1} />
        <div style={styles.glowOrb2} />

        <div style={styles.heroInner}>
          <div style={styles.eyebrow}>✦ Universal Shopping Wishlist & Collection Manager</div>
          
          <h1 style={styles.heroTitle}>
            Your entire shopping wishlist.<br />
            <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>One beautiful place.</em>
          </h1>

          <p style={styles.heroSub}>
            Save products from <strong>Myntra, Flipkart, Amazon, AJIO, Meesho</strong> and across the web into your own personal GlowWear universe. Organize outfits, track price drops, and never lose a style find again.
          </p>

          <div style={styles.heroActions}>
            <button onClick={handleStartSaving} style={styles.btnGold}>
              + Start Saving Finds ✦
            </button>
            {user ? (
              <Link to="/dashboard" style={styles.btnGhost}>
                Go to Dashboard →
              </Link>
            ) : (
              <Link to="/login" style={styles.btnGhost}>
                Sign In to Account
              </Link>
            )}
          </div>

          {/* Quick Metrics */}
          <div style={styles.metricsBar}>
            <div style={styles.metricItem}>
              <div style={styles.metricVal}>100%</div>
              <div style={styles.metricLbl}>Universal (Any Store URL)</div>
            </div>
            <div style={styles.metricDivider} />
            <div style={styles.metricItem}>
              <div style={styles.metricVal}>₹0</div>
              <div style={styles.metricLbl}>Free Personal Organizer</div>
            </div>
            <div style={styles.metricDivider} />
            <div style={styles.metricItem}>
              <div style={styles.metricVal}>📉 Live</div>
              <div style={styles.metricLbl}>Price Tracking & Drops</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── VISUAL SHOPPING FLOW ── */}
      <section style={styles.flowSection} id="how-it-works">
        <div style={styles.sectionHeading}>
          <div style={styles.secEyebrow}>How GlowWear Works</div>
          <h2 style={styles.secTitle}>From anywhere to your personal collection</h2>
          <p style={styles.secDesc}>
            No more scattered screenshots, 20 open browser tabs, or forgotten wishlists across five different shopping apps.
          </p>
        </div>

        {/* Step Cards */}
        <div style={styles.flowGrid}>
          
          <div style={styles.flowCard}>
            <div style={styles.stepNum}>01</div>
            <div style={styles.flowEmoji}>🔗</div>
            <h3 style={styles.flowTitle}>Find & Copy Link</h3>
            <p style={styles.flowText}>
              Find an outfit, footwear, or jewellery on Myntra, Flipkart, Amazon, AJIO, or Meesho. Copy the product URL.
            </p>
          </div>

          <div style={styles.flowCard}>
            <div style={styles.stepNum}>02</div>
            <div style={styles.flowEmoji}>⚡</div>
            <h3 style={styles.flowTitle}>Paste & Auto-Fetch</h3>
            <p style={styles.flowText}>
              Click <strong>+ Save Product</strong> in GlowWear. We extract the image, price, discount, and platform instantly.
            </p>
          </div>

          <div style={styles.flowCard}>
            <div style={styles.stepNum}>03</div>
            <div style={styles.flowEmoji}>📁</div>
            <h3 style={styles.flowTitle}>Organize & Track</h3>
            <p style={styles.flowText}>
              Categorize into private or shareable collections (e.g. <em>"Wedding Outfits"</em>, <em>"College"</em>), add tags, and watch for price drops.
            </p>
          </div>

          <div style={styles.flowCard}>
            <div style={styles.stepNum}>04</div>
            <div style={styles.flowEmoji}>🛍️</div>
            <h3 style={styles.flowTitle}>Shop on Original Site</h3>
            <p style={styles.flowText}>
              When you are ready to purchase, click <strong>View on Store ↗</strong> to complete the order directly on the original platform.
            </p>
          </div>

        </div>

        {/* Brand Ecosystem Banner */}
        <div style={styles.ecosystemBanner}>
          <div style={{ color: '#8a849a', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1.2rem', textAlign: 'center' }}>
            Works with all your favorite fashion & shopping destinations
          </div>
          <div style={styles.platformPills}>
            {PLATFORMS.map(p => (
              <div key={p.name} style={styles.platformPill}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: p.color }} />
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{p.name}</span>
              </div>
            ))}
            <div style={styles.platformPill}>
              <span style={{ color: '#c9a84c' }}>✦</span>
              <span style={{ fontWeight: 600, color: '#ffffff' }}>And any web link!</span>
            </div>
          </div>
        </div>

      </section>

      {/* ── CORE CAPABILITIES ── */}
      <section style={styles.featuresSection}>
        <div style={styles.featureRow}>
          <div style={styles.featureText}>
            <div style={styles.secEyebrow}>Personal Curations</div>
            <h2 style={styles.featureTitle}>Curate collections for every mood and event</h2>
            <p style={styles.featureDesc}>
              Create themed collections like <em>"Dream Vacation"</em>, <em>"Diwali Outfits"</em>, or <em>"Under ₹1500 Finds"</em>. 
              Share your curated collection link with friends and family with a single click.
            </p>
            <div style={styles.featureHighlights}>
              <div>✓ Private or public shareable links</div>
              <div>✓ Live total collection value calculator</div>
              <div>✓ Reorder and move items effortlessly</div>
            </div>
          </div>
          <div style={styles.featureGraphic}>
            <div style={styles.graphicCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>👗</span>
                <span style={{ color: '#5bb580', fontSize: '0.8rem', fontWeight: 600 }}>Public Collection</span>
              </div>
              <h4 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '0.4rem' }}>Summer Beach Vibe</h4>
              <p style={{ color: '#8a849a', fontSize: '0.85rem', marginBottom: '1rem' }}>6 handpicked finds · ₹4,290 total</p>
              <div style={styles.miniGrid}>
                <div style={styles.miniThumb}>👗</div>
                <div style={styles.miniThumb}>👡</div>
                <div style={styles.miniThumb}>🕶️</div>
                <div style={styles.miniThumb}>👜</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...styles.featureRow, flexDirection: 'row-reverse', marginTop: '5rem' }}>
          <div style={styles.featureText}>
            <div style={styles.secEyebrow}>Smart Price Tracking</div>
            <h2 style={styles.featureTitle}>Never overpay. Track price drops automatically.</h2>
            <p style={styles.featureDesc}>
              GlowWear stores previous prices and highlights when a saved item drops in price. Visual step charts show you the historical price trend so you know the optimal time to buy.
            </p>
            <div style={styles.featureHighlights}>
              <div>✓ Instant price drop alerts on your dashboard</div>
              <div>✓ Visual price history chart for every product</div>
              <div>✓ Personal notes for size, coupons, and fit details</div>
            </div>
          </div>
          <div style={styles.featureGraphic}>
            <div style={styles.graphicCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ background: 'rgba(91,181,128,0.15)', color: '#5bb580', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 }}>
                  🎉 ₹500 Price Drop
                </span>
                <span style={{ color: '#8a849a', fontSize: '0.75rem' }}>Myntra</span>
              </div>
              <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.4rem' }}>Black Denim Cut-Out A-Line Dress</h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '1rem' }}>
                <span style={{ color: '#c9a84c', fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>₹593</span>
                <span style={{ color: '#8a849a', fontSize: '0.9rem', textDecoration: 'line-through' }}>₹2,199</span>
                <span style={{ color: '#5bb580', fontSize: '0.8rem', fontWeight: 600 }}>73% OFF</span>
              </div>
              <div style={{ background: '#111018', borderRadius: '10px', padding: '0.6rem 0.8rem', fontSize: '0.78rem', color: '#8a849a' }}>
                💬 "Wait for festive discount before buying"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaBox}>
          <div style={styles.eyebrow}>Join GlowWear 2.0</div>
          <h2 style={styles.ctaTitle}>Start organizing your personal shopping universe</h2>
          <p style={styles.ctaText}>
            Sign up in 30 seconds. No credit card required. Free forever personal organizer.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleStartSaving} style={styles.btnGold}>
              Create Free Account & Start Saving ✦
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div>
            <div style={styles.footerLogo}>GlowWear ✦</div>
            <p style={styles.footerDesc}>
              Universal personal shopping wishlist & collection manager. Save it. Organize it. Shop it.
            </p>
          </div>
          <div style={styles.footerLinks}>
            <Link to="/dashboard" style={styles.footerLink}>Dashboard</Link>
            <Link to="/collections" style={styles.footerLink}>Collections</Link>
            <Link to="/wishlist" style={styles.footerLink}>Wishlist</Link>
            <Link to="/login" style={styles.footerLink}>Sign In</Link>
          </div>
        </div>
        <div style={styles.footerBottom}>
          © 2026 GlowWear · All rights reserved. External trademarks belong to their respective owners.
        </div>
      </footer>

      {/* Save Modal */}
      <SaveProductModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onProductSaved={() => navigate('/dashboard')}
      />

    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a090d',
    color: '#ffffff'
  },
  hero: {
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1.5rem',
    position: 'relative',
    overflow: 'hidden'
  },
  glowOrb1: {
    position: 'absolute',
    top: '-150px',
    left: '-150px',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,168,76,0.1), transparent 70%)',
    pointerEvents: 'none'
  },
  glowOrb2: {
    position: 'absolute',
    bottom: '-150px',
    right: '-100px',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,96,122,0.12), transparent 70%)',
    pointerEvents: 'none'
  },
  heroInner: {
    maxWidth: '840px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1
  },
  eyebrow: {
    fontSize: '0.75rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '1.2rem',
    fontWeight: 600
  },
  heroTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(2.6rem, 6.5vw, 4.8rem)',
    fontWeight: 300,
    lineHeight: 1.15,
    marginBottom: '1.5rem',
    color: '#ffffff'
  },
  heroSub: {
    fontSize: '1.05rem',
    color: '#a59eb8',
    lineHeight: 1.8,
    maxWidth: '680px',
    margin: '0 auto 2.5rem'
  },
  heroActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '3rem'
  },
  btnGold: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0.95rem 2.2rem',
    borderRadius: '50px',
    fontSize: '0.92rem',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: '0 8px 25px rgba(201,168,76,0.3)',
    transition: 'transform 0.2s'
  },
  btnGhost: {
    background: 'transparent',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '0.95rem 2.2rem',
    borderRadius: '50px',
    fontSize: '0.92rem',
    fontWeight: 600,
    textDecoration: 'none'
  },
  metricsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2.5rem',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    flexWrap: 'wrap'
  },
  metricItem: {
    textAlign: 'center'
  },
  metricVal: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.8rem',
    color: '#c9a84c',
    fontWeight: 600
  },
  metricLbl: {
    fontSize: '0.72rem',
    color: '#8a849a',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    marginTop: '2px'
  },
  metricDivider: {
    width: '1px',
    height: '35px',
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  flowSection: {
    padding: '5rem 1.5rem',
    maxWidth: '1280px',
    margin: '0 auto'
  },
  sectionHeading: {
    textAlign: 'center',
    maxWidth: '650px',
    margin: '0 auto 3.5rem'
  },
  secEyebrow: {
    fontSize: '0.72rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '0.6rem'
  },
  secTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 300,
    color: '#ffffff',
    marginBottom: '0.8rem'
  },
  secDesc: {
    color: '#8a849a',
    fontSize: '0.95rem',
    lineHeight: 1.7
  },
  flowGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '4rem'
  },
  flowCard: {
    background: '#14121a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    padding: '2rem 1.5rem',
    position: 'relative'
  },
  stepNum: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#c9a84c',
    letterSpacing: '1px',
    marginBottom: '1rem'
  },
  flowEmoji: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  flowTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '0.5rem'
  },
  flowText: {
    color: '#8a849a',
    fontSize: '0.85rem',
    lineHeight: 1.6
  },
  ecosystemBanner: {
    background: '#111018',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '24px',
    padding: '2rem'
  },
  platformPills: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  platformPill: {
    background: '#18161f',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '50px',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem'
  },
  featuresSection: {
    padding: '5rem 1.5rem',
    maxWidth: '1280px',
    margin: '0 auto'
  },
  featureRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4rem',
    flexWrap: 'wrap'
  },
  featureText: {
    flex: 1,
    minWidth: '300px'
  },
  featureTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
    fontWeight: 300,
    color: '#ffffff',
    margin: '0.6rem 0 1.2rem'
  },
  featureDesc: {
    color: '#8a849a',
    fontSize: '0.95rem',
    lineHeight: 1.8,
    marginBottom: '1.5rem'
  },
  featureHighlights: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    color: '#c9a84c',
    fontSize: '0.88rem',
    fontWeight: 500
  },
  featureGraphic: {
    flex: 1,
    minWidth: '300px',
    display: 'flex',
    justifyContent: 'center'
  },
  graphicCard: {
    background: '#18161f',
    border: '1px solid rgba(201,168,76,0.25)',
    borderRadius: '24px',
    padding: '2rem',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
  },
  miniGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px'
  },
  miniThumb: {
    background: '#111018',
    borderRadius: '10px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    border: '1px solid rgba(255,255,255,0.06)'
  },
  ctaSection: {
    padding: '4rem 1.5rem 6rem',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  ctaBox: {
    background: 'linear-gradient(135deg, #1f1a26, #121019)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: '30px',
    padding: '4rem 2rem',
    textAlign: 'center'
  },
  ctaTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 300,
    color: '#ffffff',
    margin: '0.6rem 0 1rem'
  },
  ctaText: {
    color: '#8a849a',
    fontSize: '0.95rem',
    maxWidth: '500px',
    margin: '0 auto 2rem'
  },
  footer: {
    background: '#111018',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '4rem 1.5rem 2rem'
  },
  footerInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '2rem',
    flexWrap: 'wrap',
    marginBottom: '3rem'
  },
  footerLogo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.8rem',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '0.6rem'
  },
  footerDesc: {
    color: '#8a849a',
    fontSize: '0.85rem',
    maxWidth: '360px',
    lineHeight: 1.6
  },
  footerLinks: {
    display: 'flex',
    gap: '1.8rem',
    flexWrap: 'wrap'
  },
  footerLink: {
    color: '#8a849a',
    textDecoration: 'none',
    fontSize: '0.85rem'
  },
  footerBottom: {
    maxWidth: '1280px',
    margin: '0 auto',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    textAlign: 'center',
    color: '#8a849a',
    fontSize: '0.78rem'
  }
};

export default Home;