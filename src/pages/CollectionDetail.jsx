import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import SaveProductModal from '../components/SaveProductModal';
import CollectionModal from '../components/CollectionModal';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchCollection = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getCollection(id);
      if (res.success) {
        setCollection(res.collection);
        setProducts(res.products || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load collection.');
      navigate('/collections');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const handleCopyShareLink = () => {
    if (!collection) return;
    const shareUrl = `${window.location.origin}/c/${collection.shareId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success('Public share link copied! 📋'))
      .catch(() => toast.error('Failed to copy link.'));
  };

  const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingBox}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s infinite linear' }}>✦</div>
          <p style={{ color: '#8a849a', marginTop: '1rem' }}>Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!collection) return null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Back Link */}
        <Link to="/collections" style={styles.backLink}>
          ← Back to All Collections
        </Link>

        {/* Header Hero */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.emojiBadge}>{collection.emoji}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                <h1 style={styles.title}>{collection.title}</h1>
                <span style={{
                  ...styles.statusPill,
                  color: collection.isPublic ? '#5bb580' : '#8a849a',
                  borderColor: collection.isPublic ? 'rgba(91,181,128,0.3)' : 'rgba(255,255,255,0.08)'
                }}>
                  {collection.isPublic ? '🌐 Public' : '🔒 Private'}
                </span>
              </div>
              {collection.description && (
                <p style={styles.description}>{collection.description}</p>
              )}
              <div style={styles.metaRow}>
                <span>{products.length} saved product{products.length !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span style={{ color: '#c9a84c', fontWeight: 600 }}>₹{totalValue.toLocaleString('en-IN')} total value</span>
              </div>
            </div>
          </div>

          <div style={styles.actions}>
            {collection.isPublic && (
              <button style={styles.shareBtn} onClick={handleCopyShareLink}>
                🔗 Copy Share Link
              </button>
            )}
            <button style={styles.editBtn} onClick={() => setShowEditModal(true)}>
              ✎ Edit Collection
            </button>
            <button style={styles.addBtn} onClick={() => setShowSaveModal(true)}>
              + Add Product ✦
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div style={styles.grid}>
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onUpdated={fetchCollection}
                onDeleted={fetchCollection}
              />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛍️</div>
            <h3 style={styles.emptyTitle}>This collection is empty</h3>
            <p style={styles.emptySub}>
              Start adding your favorite dresses, shoes, or accessories to <strong>{collection.title}</strong>!
            </p>
            <button onClick={() => setShowSaveModal(true)} style={styles.addBtn}>
              + Save a Product Here ✦
            </button>
          </div>
        )}

      </div>

      {/* Modals */}
      <SaveProductModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        initialCollectionId={collection.id}
        onProductSaved={fetchCollection}
      />

      <CollectionModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        collection={collection}
        onCollectionSaved={fetchCollection}
      />

    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a090d',
    padding: '2rem 1.5rem 5rem'
  },
  container: {
    maxWidth: '1360px',
    margin: '0 auto'
  },
  backLink: {
    display: 'inline-block',
    color: '#8a849a',
    textDecoration: 'none',
    fontSize: '0.85rem',
    marginBottom: '1.5rem'
  },
  header: {
    background: '#14121a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '2.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    marginBottom: '2.5rem'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flex: 1,
    minWidth: '280px'
  },
  emojiBadge: {
    width: '75px',
    height: '75px',
    borderRadius: '20px',
    background: 'rgba(201,168,76,0.1)',
    border: '1px solid rgba(201,168,76,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    flexShrink: 0
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
    fontWeight: 400,
    color: '#ffffff'
  },
  statusPill: {
    fontSize: '0.72rem',
    border: '1px solid',
    padding: '0.2rem 0.6rem',
    borderRadius: '50px',
    fontWeight: 600
  },
  description: {
    color: '#8a849a',
    fontSize: '0.92rem',
    marginBottom: '0.6rem',
    maxWidth: '600px'
  },
  metaRow: {
    display: 'flex',
    gap: '8px',
    fontSize: '0.82rem',
    color: '#8a849a'
  },
  actions: {
    display: 'flex',
    gap: '0.8rem',
    flexWrap: 'wrap'
  },
  shareBtn: {
    background: 'rgba(201,168,76,0.15)',
    border: '1px solid rgba(201,168,76,0.4)',
    color: '#c9a84c',
    padding: '0.75rem 1.4rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  editBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#ffffff',
    padding: '0.75rem 1.4rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer'
  },
  addBtn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0.75rem 1.6rem',
    borderRadius: '12px',
    fontSize: '0.88rem',
    fontWeight: 700,
    cursor: 'pointer'
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
    margin: '2rem auto'
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

export default CollectionDetail;
