import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import CollectionModal from '../components/CollectionModal';
import SaveProductModal from '../components/SaveProductModal';

const CollectionsPage = () => {
  const toast = useToast();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingCol, setEditingCol] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveColId, setSaveColId] = useState('');

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getCollections();
      if (res.success) setCollections(res.collections);
    } catch (err) {
      toast.error('Failed to load collections.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleCopyShareLink = (shareId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/c/${shareId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success('Shareable link copied to clipboard! 📋'))
      .catch(() => toast.error('Failed to copy link.'));
  };

  const handleDelete = async (colId, title, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete the "${title}" collection? (Saved products will remain in your account)`)) return;

    try {
      await api.deleteCollection(colId);
      toast.success('Collection deleted.');
      fetchCollections();
    } catch (err) {
      toast.error('Failed to delete collection.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Personal Curations</div>
            <h1 style={styles.title}>
              My <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Collections</em>
            </h1>
            <p style={styles.sub}>
              Organize your fashion finds into thematic lookbooks, event wishlists, or price categories.
            </p>
          </div>

          <button
            style={styles.newColBtn}
            onClick={() => { setEditingCol(null); setShowModal(true); }}
          >
            + Create Collection ✦
          </button>
        </div>

        {/* Collections Grid */}
        {loading ? (
          <div style={styles.loadingBox}>
            <div style={{ fontSize: '2rem', animation: 'spin 1s infinite linear' }}>✦</div>
            <p style={{ color: '#8a849a', marginTop: '1rem' }}>Loading collections...</p>
          </div>
        ) : collections.length > 0 ? (
          <div style={styles.grid}>
            {collections.map(col => (
              <div key={col.id} style={styles.card}>
                
                {/* Header row */}
                <div style={styles.cardHeader}>
                  <span style={styles.emoji}>{col.emoji}</span>
                  <span style={{
                    ...styles.visibilityPill,
                    color: col.isPublic ? '#5bb580' : '#8a849a',
                    borderColor: col.isPublic ? 'rgba(91,181,128,0.3)' : 'rgba(255,255,255,0.08)'
                  }}>
                    {col.isPublic ? '🌐 Public' : '🔒 Private'}
                  </span>
                </div>

                <Link to={`/collection/${col.id}`} style={styles.cardLink}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <h3 style={styles.colTitle}>{col.title}</h3>
                    <span style={{ color: '#c9a84c', fontSize: '0.8rem', fontWeight: 600 }}>Open →</span>
                  </div>
                  {col.description && (
                    <p style={styles.colDesc}>{col.description}</p>
                  )}
                </Link>

                {/* Preview Thumbnails */}
                {col.previewImages && col.previewImages.length > 0 ? (
                  <div style={styles.thumbsRow}>
                    {col.previewImages.slice(0, 4).map((img, i) => (
                      <div key={i} style={styles.thumb}>
                        <img src={img} alt="preview" style={styles.thumbImg} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    style={styles.emptyThumbBoxBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      setSaveColId(col.id);
                      setShowSaveModal(true);
                    }}
                  >
                    + Add first product to {col.title}
                  </button>
                )}

                {/* Footer details */}
                <div style={styles.cardFooter}>
                  <div>
                    <div style={styles.itemCount}>{col.itemCount} items</div>
                    <div style={styles.estValue}>₹{col.estimatedValue.toLocaleString('en-IN')} total</div>
                  </div>

                  <div style={styles.cardActions}>
                    <button
                      style={styles.addDirectBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        setSaveColId(col.id);
                        setShowSaveModal(true);
                      }}
                      title="Add product to this collection"
                    >
                      + Add Item
                    </button>
                    {col.isPublic && (
                      <button
                        style={styles.actionIconBtn}
                        onClick={(e) => handleCopyShareLink(col.shareId, e)}
                        title="Copy Public Share Link"
                      >
                        🔗 Share
                      </button>
                    )}
                    <button
                      style={styles.actionIconBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        setEditingCol(col);
                        setShowModal(true);
                      }}
                      title="Edit Collection"
                    >
                      ✎
                    </button>
                    <button
                      style={{ ...styles.actionIconBtn, color: '#d4607a' }}
                      onClick={(e) => handleDelete(col.id, col.title, e)}
                      title="Delete Collection"
                    >
                      🗑
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>✨</div>
            <h3 style={styles.emptyTitle}>Your wardrobe is waiting ✨</h3>
            <p style={styles.emptySub}>
              Create your first collection and start saving your favorite finds across Myntra, Flipkart, Amazon and more.
            </p>
            <button
              onClick={() => { setEditingCol(null); setShowModal(true); }}
              style={styles.newColBtn}
            >
              + Create Collection ✦
            </button>
          </div>
        )}

      </div>

      <CollectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCollectionSaved={fetchCollections}
        collection={editingCol}
      />

      <SaveProductModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        initialCollectionId={saveColId}
        onProductSaved={fetchCollections}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1.5rem',
    marginBottom: '3rem',
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
  newColBtn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0.8rem 1.6rem',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(201,168,76,0.25)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    background: '#14121a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '1.6rem',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, border-color 0.2s'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  emoji: {
    fontSize: '2.2rem'
  },
  visibilityPill: {
    fontSize: '0.72rem',
    border: '1px solid',
    padding: '0.2rem 0.6rem',
    borderRadius: '50px',
    fontWeight: 600
  },
  cardLink: {
    textDecoration: 'none',
    marginBottom: '1.2rem',
    display: 'block'
  },
  colTitle: {
    color: '#ffffff',
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '0.3rem'
  },
  colDesc: {
    color: '#8a849a',
    fontSize: '0.82rem',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  thumbsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
    marginBottom: '1.5rem'
  },
  thumb: {
    height: '65px',
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#18161f'
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  emptyThumbBox: {
    height: '65px',
    background: '#18161f',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    border: '1px dashed rgba(255,255,255,0.06)'
  },
  cardFooter: {
    marginTop: 'auto',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemCount: {
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.88rem'
  },
  estValue: {
    color: '#c9a84c',
    fontSize: '0.75rem',
    marginTop: '2px'
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  addDirectBtn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0.35rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer'
  },
  emptyThumbBoxBtn: {
    height: '65px',
    background: 'rgba(201,168,76,0.04)',
    border: '1px dashed rgba(201,168,76,0.3)',
    borderRadius: '10px',
    color: '#c9a84c',
    fontSize: '0.82rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    width: '100%',
    fontFamily: "'Outfit', sans-serif"
  },
  actionIconBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#ffffff',
    padding: '0.35rem 0.65rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    cursor: 'pointer'
  },
  loadingBox: {
    textAlign: 'center',
    padding: '6rem 2rem'
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
  }
};

export default CollectionsPage;
