import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const SharedCollection = () => {
  const { shareId } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getSharedCollection(shareId)
      .then(res => {
        if (res.success) {
          setCollection(res.collection);
        } else {
          setError(res.message || 'Collection not found.');
        }
      })
      .catch(err => {
        setError(err.message || 'This collection is private or does not exist.');
      })
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.centerBox}>
          <div style={{ fontSize: '2.5rem', animation: 'spin 1s infinite linear' }}>✦</div>
          <p style={{ color: '#8a849a', marginTop: '1rem' }}>Loading shared collection...</p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div style={styles.page}>
        <div style={styles.centerBox}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Private or Not Found</h2>
          <p style={{ color: '#8a849a', marginBottom: '2rem' }}>
            {error || 'This collection might have been deleted or set to private by its owner.'}
          </p>
          <Link to="/" style={styles.btnGold}>Discover GlowWear →</Link>
        </div>
      </div>
    );
  }

  const products = collection.products || [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* Banner */}
        <div style={styles.banner}>
          <div style={styles.bannerLeft}>
            <div style={styles.emojiBadge}>{collection.emoji}</div>
            <div>
              <div style={styles.curatedBy}>Curated by {collection.ownerName} ✦</div>
              <h1 style={styles.title}>{collection.title}</h1>
              {collection.description && (
                <p style={styles.desc}>{collection.description}</p>
              )}
              <div style={styles.metaRow}>
                <span>{products.length} fashion finds</span>
                <span>·</span>
                <span style={{ color: '#c9a84c' }}>₹{collection.estimatedValue.toLocaleString('en-IN')} total</span>
              </div>
            </div>
          </div>

          <div style={styles.bannerRight}>
            <Link to="/signup" style={styles.btnGold}>
              Create Your Own GlowWear Wishlist ✦
            </Link>
          </div>
        </div>

        {/* Product Cards */}
        <div style={styles.grid}>
          {products.map(p => {
            const discount = p.originalPrice && p.originalPrice > p.price
              ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
              : 0;

            return (
              <div key={p.id} style={styles.card}>
                <div style={styles.imgBox}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} style={styles.img} />
                  ) : (
                    <span style={{ fontSize: '4rem' }}>{collection.emoji}</span>
                  )}
                  <span style={styles.platformBadge}>{p.platform || 'Store'}</span>
                  {discount > 0 && <span style={styles.discountBadge}>{discount}% OFF</span>}
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.category}>{p.category}</div>
                  <h4 style={styles.cardTitle}>{p.title}</h4>
                  
                  <div style={styles.priceRow}>
                    <span style={styles.price}>₹{p.price}</span>
                    {p.originalPrice > p.price && (
                      <span style={styles.oldPrice}>₹{p.originalPrice}</span>
                    )}
                  </div>

                  {p.notes && (
                    <div style={styles.noteBox}>
                      💬 {p.notes}
                    </div>
                  )}

                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.viewBtn}
                  >
                    View on {p.platform || 'Store'} ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a090d',
    padding: '3rem 1.5rem 6rem'
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto'
  },
  centerBox: {
    textAlign: 'center',
    padding: '8rem 2rem',
    maxWidth: '500px',
    margin: '0 auto'
  },
  banner: {
    background: '#14121a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '2.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    marginBottom: '3rem'
  },
  bannerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flex: 1,
    minWidth: '280px'
  },
  emojiBadge: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: 'rgba(201,168,76,0.1)',
    border: '1px solid rgba(201,168,76,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.8rem',
    flexShrink: 0
  },
  curatedBy: {
    fontSize: '0.75rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '0.3rem',
    fontWeight: 600
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
    color: '#ffffff',
    marginBottom: '0.4rem'
  },
  desc: {
    color: '#8a849a',
    fontSize: '0.92rem',
    marginBottom: '0.6rem'
  },
  metaRow: {
    display: 'flex',
    gap: '8px',
    fontSize: '0.82rem',
    color: '#8a849a'
  },
  bannerRight: {
    flexShrink: 0
  },
  btnGold: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    padding: '0.85rem 1.8rem',
    borderRadius: '50px',
    fontWeight: 700,
    fontSize: '0.88rem',
    textDecoration: 'none',
    display: 'inline-block'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    background: '#18161f',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  imgBox: {
    height: '220px',
    background: '#111018',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  platformBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: 'rgba(10,9,13,0.85)',
    color: '#ffffff',
    fontSize: '0.68rem',
    fontWeight: 700,
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  discountBadge: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    background: '#d4607a',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '0.25rem 0.55rem',
    borderRadius: '50px'
  },
  cardBody: {
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  category: {
    fontSize: '0.68rem',
    color: '#8a849a',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '0.3rem'
  },
  cardTitle: {
    fontSize: '0.95rem',
    color: '#ffffff',
    fontWeight: 600,
    marginBottom: '0.8rem',
    lineHeight: 1.4
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.6rem',
    marginBottom: '0.8rem'
  },
  price: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#c9a84c'
  },
  oldPrice: {
    fontSize: '0.82rem',
    color: '#8a849a',
    textDecoration: 'line-through'
  },
  noteBox: {
    background: 'rgba(201,168,76,0.06)',
    borderRadius: '8px',
    padding: '0.4rem 0.6rem',
    fontSize: '0.78rem',
    color: '#c9a84c',
    marginBottom: '0.8rem'
  },
  viewBtn: {
    marginTop: 'auto',
    background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))',
    border: '1px solid rgba(201,168,76,0.3)',
    color: '#c9a84c',
    padding: '0.6rem 0.8rem',
    borderRadius: '10px',
    fontSize: '0.82rem',
    fontWeight: 600,
    textAlign: 'center',
    textDecoration: 'none'
  }
};

export default SharedCollection;
