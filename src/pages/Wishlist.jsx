import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import SaveProductModal from '../components/SaveProductModal';

const Wishlist = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.getProducts({ isWishlisted: true });
      if (res.success) {
        setProducts(res.products);
      }
    } catch (err) {
      toast.error('Failed to load wishlist.');
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.centerBox}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={styles.title}>Login to View Your Wishlist</h2>
          <p style={styles.sub}>
            Save your favorite finds from Myntra, Flipkart, Amazon and across the web in one universal account.
          </p>
          <div style={styles.btnRow}>
            <Link to="/login" style={styles.btnGold}>Login →</Link>
            <Link to="/signup" style={styles.btnGhost}>Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Universal Wishlist</div>
            <h1 style={styles.title}>
              My <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Wishlist</em> ❤️
            </h1>
            <p style={styles.sub}>
              {products.length} saved item{products.length !== 1 ? 's' : ''} · ₹{totalValue.toLocaleString('en-IN')} total estimated value
            </p>
          </div>

          <div style={styles.headerActions}>
            <Link to="/dashboard" style={styles.btnGhost}>
              ← Dashboard
            </Link>
            <button onClick={() => setShowSaveModal(true)} style={styles.btnGold}>
              + Save New Item ✦
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={styles.loadingBox}>
            <div style={{ fontSize: '2rem', animation: 'spin 1s infinite linear' }}>✦</div>
            <p style={{ color: '#8a849a', marginTop: '1rem' }}>Loading wishlist...</p>
          </div>
        ) : products.length > 0 ? (
          <div style={styles.grid}>
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onUpdated={fetchWishlist}
                onDeleted={fetchWishlist}
              />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>💛</div>
            <h3 style={styles.emptyTitle}>Your wishlist is empty</h3>
            <p style={styles.emptySub}>
              Browse online stores and save items you love directly into GlowWear!
            </p>
            <button onClick={() => setShowSaveModal(true)} style={styles.btnGold}>
              + Save Your First Find ✦
            </button>
          </div>
        )}

      </div>

      <SaveProductModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onProductSaved={fetchWishlist}
      />
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a090d',
    padding: '2.5rem 1.5rem 5rem'
  },
  container: {
    maxWidth: '1360px',
    margin: '0 auto'
  },
  centerBox: {
    textAlign: 'center',
    padding: '6rem 2rem',
    maxWidth: '520px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '1.5rem',
    marginBottom: '2.5rem',
    flexWrap: 'wrap'
  },
  eyebrow: {
    fontSize: '0.72rem',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '0.4rem',
    fontWeight: 600
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 300,
    color: '#ffffff',
    marginBottom: '0.3rem'
  },
  sub: {
    color: '#8a849a',
    fontSize: '0.92rem'
  },
  headerActions: {
    display: 'flex',
    gap: '0.8rem',
    flexWrap: 'wrap'
  },
  btnGold: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0.8rem 1.6rem',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block'
  },
  btnGhost: {
    background: 'transparent',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '0.8rem 1.4rem',
    borderRadius: '12px',
    fontSize: '0.88rem',
    textDecoration: 'none',
    display: 'inline-block'
  },
  btnRow: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  emptyState: {
    background: '#14121a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '24px',
    padding: '5rem 2rem',
    textAlign: 'center',
    maxWidth: '560px',
    margin: '3rem auto'
  },
  emptyTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.8rem',
    color: '#ffffff',
    marginBottom: '0.6rem'
  },
  emptySub: {
    color: '#8a849a',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    marginBottom: '2rem'
  },
  loadingBox: {
    textAlign: 'center',
    padding: '6rem 2rem'
  }
};

export default Wishlist;