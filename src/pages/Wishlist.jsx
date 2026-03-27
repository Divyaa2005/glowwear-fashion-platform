import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import products from '../data/products';

const Wishlist = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.center}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={styles.title}>Login to see your Wishlist</h2>
          <p style={styles.sub}>Save your favourite items and access them anytime!</p>
          <div style={styles.btns}>
            <Link to="/login" style={styles.btnGold}>Login →</Link>
            <Link to="/signup" style={styles.btnGhost}>Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  const wishlistItems = products.filter(p => user.wishlist?.includes(p.id));

  return (
    <div style={styles.page}>
      <div style={styles.content}>

        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Your Collection</div>
            <h1 style={styles.title}>
              My <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Wishlist</em>
            </h1>
            <p style={styles.sub}>
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <Link to="/" style={styles.backBtn}>← Continue Shopping</Link>
        </div>

        {wishlistItems.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>💛</div>
            <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
              Your wishlist is empty
            </h3>
            <p style={{ color: '#8a849a', marginBottom: '2rem' }}>
              Browse categories and save items you love!
            </p>
            <Link to="/" style={styles.btnGold}>Start Shopping →</Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {wishlistItems.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a090d',
    paddingTop: '68px',
  },
  content: {
    maxWidth: '1300px',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    textAlign: 'center',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '3rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  eyebrow: {
    fontSize: '0.7rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '0.5rem',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 300,
    color: '#ffffff',
    marginBottom: '0.3rem',
  },
  sub: {
    color: '#8a849a',
    fontSize: '0.9rem',
  },
  backBtn: {
    color: '#8a849a',
    textDecoration: 'none',
    fontSize: '0.85rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
    gap: '1.5rem',
  },
  empty: {
    textAlign: 'center',
    padding: '5rem 2rem',
  },
  btns: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btnGold: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    padding: '0.9rem 2rem',
    borderRadius: '50px',
    fontWeight: 700,
    fontSize: '0.88rem',
    textDecoration: 'none',
  },
  btnGhost: {
    background: 'transparent',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '0.9rem 2rem',
    borderRadius: '50px',
    fontSize: '0.88rem',
    textDecoration: 'none',
  },
};

export default Wishlist;