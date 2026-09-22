import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PriceHistoryModal from './PriceHistoryModal';
import EditProductModal from './EditProductModal';

const PLATFORM_COLORS = {
  Myntra: '#FF3F6C',
  Flipkart: '#2874F0',
  Amazon: '#FF9900',
  AJIO: '#DB1F26',
  Meesho: '#F43397',
  Nykaa: '#FC2779',
  Zara: '#000000',
  'H&M': '#BA0C2F',
  Other: '#c9a84c'
};

const ProductCard = ({ product, onUpdated, onDeleted, onTagClick }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Detect recent price drop
  const hasPriceDrop = product.priceHistory && product.priceHistory.length > 1 &&
    product.price < product.priceHistory[0].price;

  const platformColor = PLATFORM_COLORS[product.platform] || '#c9a84c';

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.warning('Please log in to save items to your wishlist.');
      return;
    }
    setIsUpdating(true);
    try {
      const res = await api.updateProduct(product.id, {
        isWishlisted: !product.isWishlisted
      });
      toast.success(res.product.isWishlisted ? 'Added to Wishlist ❤️' : 'Removed from Wishlist');
      if (onUpdated) onUpdated(res.product);
    } catch (err) {
      toast.error('Failed to update wishlist status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      const res = await api.updateProduct(product.id, { status: newStatus });
      toast.success(`Status marked as ${newStatus}!`);
      if (onUpdated) onUpdated(res.product);
    } catch (err) {
      toast.error('Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.title}" from your GlowWear collection?`)) return;
    try {
      await api.deleteProduct(product.id);
      toast.success('Product deleted.');
      if (onDeleted) onDeleted(product.id);
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  return (
    <>
      <div style={styles.card}>
        
        {/* Top Image Box */}
        <div style={styles.imgBox}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} style={styles.img} />
          ) : (
            <span style={styles.emoji}>{product.emoji || '🛍️'}</span>
          )}

          {/* Platform Badge */}
          <span style={{ ...styles.platformBadge, backgroundColor: platformColor }}>
            {product.platform || 'Store'}
          </span>

          {/* Discount Badge */}
          {discount > 0 && (
            <span style={styles.discountBadge}>
              {discount}% OFF
            </span>
          )}

          {/* Price Drop Alert Pill */}
          {hasPriceDrop && (
            <button
              style={styles.priceDropPill}
              onClick={() => setShowPriceHistory(true)}
              title="Price dropped! Click to see history"
            >
              🎉 Price Drop
            </button>
          )}

          {/* Wishlist Button */}
          <button
            style={{
              ...styles.wishBtn,
              background: product.isWishlisted ? 'rgba(212,96,122,0.3)' : 'rgba(10,9,13,0.6)',
              borderColor: product.isWishlisted ? '#d4607a' : 'rgba(255,255,255,0.15)',
              color: product.isWishlisted ? '#d4607a' : '#ffffff'
            }}
            onClick={handleToggleWishlist}
            disabled={isUpdating}
            title={product.isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            {product.isWishlisted ? '♥' : '♡'}
          </button>
        </div>

        {/* Card Body */}
        <div style={styles.body}>
          
          <div style={styles.categoryRow}>
            <span style={styles.category}>{product.category}</span>
            {product.status && (
              <select
                value={product.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                style={{
                  ...styles.statusBadge,
                  background: 'transparent',
                  color: product.status === 'purchased' ? '#5bb580' : product.status === 'to-buy' ? '#e8cb80' : '#8a849a',
                  borderColor: product.status === 'purchased' ? 'rgba(91,181,128,0.3)' : product.status === 'to-buy' ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="saved" style={{ background: '#18161f', color: '#8a849a' }}>💖 Saved</option>
                <option value="to-buy" style={{ background: '#18161f', color: '#e8cb80' }}>🛍️ To Buy</option>
                <option value="purchased" style={{ background: '#18161f', color: '#5bb580' }}>✓ Purchased</option>
              </select>
            )}
          </div>

          <h4 style={styles.title} title={product.title}>
            {product.title}
          </h4>

          {/* Price Row */}
          <div style={styles.priceRow}>
            <span style={styles.price}>₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span style={styles.oldPrice}>₹{product.originalPrice}</span>
            )}
            <button
              style={styles.chartIconBtn}
              onClick={() => setShowPriceHistory(true)}
              title="View Price Tracking History"
            >
              📈 Price History
            </button>
          </div>

          {/* Note Preview */}
          {product.notes && (
            <div style={styles.noteBox} title={product.notes}>
              <span style={{ color: '#c9a84c', marginRight: '4px' }}>💬</span>
              <span style={styles.noteText}>{product.notes}</span>
            </div>
          )}

          {/* Tags */}
          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div style={styles.tagRow}>
              {product.tags.slice(0, 3).map((t, idx) => (
                <span
                  key={idx}
                  style={styles.tag}
                  onClick={() => onTagClick && onTagClick(t)}
                >
                  {t}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span style={styles.tagMore}>+{product.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={styles.actions}>
            {product.url ? (
              <a
                href={product.url}
                target="_blank"
                rel="noreferrer"
                style={styles.primaryCta}
              >
                View on {product.platform || 'Store'} ↗
              </a>
            ) : (
              <div style={styles.primaryCtaDisabled}>Saved Item</div>
            )}

            <button
              style={styles.editBtn}
              onClick={() => setShowEdit(true)}
              title="Edit Product"
            >
              ✎
            </button>

            <button
              style={styles.deleteBtn}
              onClick={handleDelete}
              title="Delete Product"
            >
              🗑
            </button>
          </div>

        </div>

      </div>

      {/* Modals */}
      <PriceHistoryModal
        isOpen={showPriceHistory}
        onClose={() => setShowPriceHistory(false)}
        product={product}
      />

      <EditProductModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        product={product}
        onUpdated={onUpdated}
      />
    </>
  );
};

const styles = {
  card: {
    background: '#18161f',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s'
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
  emoji: {
    fontSize: '4.5rem'
  },
  platformBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    color: '#ffffff',
    fontSize: '0.68rem',
    fontWeight: 700,
    padding: '0.3rem 0.65rem',
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
  },
  discountBadge: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    background: 'linear-gradient(135deg, #d4607a, #b04060)',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '0.25rem 0.55rem',
    borderRadius: '50px',
    letterSpacing: '0.5px'
  },
  priceDropPill: {
    position: 'absolute',
    top: '12px',
    right: '50px',
    background: 'rgba(91,181,128,0.9)',
    color: '#0a090d',
    border: 'none',
    fontSize: '0.68rem',
    fontWeight: 700,
    padding: '0.3rem 0.65rem',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
  },
  wishBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s'
  },
  body: {
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.4rem'
  },
  category: {
    fontSize: '0.68rem',
    color: '#8a849a',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  statusBadge: {
    fontSize: '0.65rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '50px',
    border: '1px solid',
    fontWeight: 600
  },
  title: {
    fontSize: '0.92rem',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '0.6rem',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.6rem',
    marginBottom: '0.8rem',
    flexWrap: 'wrap'
  },
  price: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#c9a84c'
  },
  oldPrice: {
    fontSize: '0.8rem',
    color: '#8a849a',
    textDecoration: 'line-through'
  },
  chartIconBtn: {
    background: 'none',
    border: 'none',
    color: '#8a849a',
    fontSize: '0.72rem',
    cursor: 'pointer',
    marginLeft: 'auto',
    padding: '2px',
    textDecoration: 'underline'
  },
  noteBox: {
    background: 'rgba(201,168,76,0.06)',
    border: '1px dashed rgba(201,168,76,0.2)',
    borderRadius: '8px',
    padding: '0.4rem 0.6rem',
    fontSize: '0.75rem',
    color: '#d6d2e0',
    marginBottom: '0.8rem',
    display: 'flex',
    alignItems: 'center'
  },
  noteText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  tagRow: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    marginBottom: '0.8rem'
  },
  tag: {
    fontSize: '0.68rem',
    color: '#c9a84c',
    background: 'rgba(201,168,76,0.1)',
    padding: '0.15rem 0.45rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  tagMore: {
    fontSize: '0.68rem',
    color: '#8a849a',
    padding: '0.15rem 0.3rem'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: 'auto',
    paddingTop: '0.8rem',
    borderTop: '1px solid rgba(255,255,255,0.06)'
  },
  primaryCta: {
    flex: 1,
    background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))',
    border: '1px solid rgba(201,168,76,0.3)',
    color: '#c9a84c',
    padding: '0.55rem 0.8rem',
    borderRadius: '10px',
    fontSize: '0.78rem',
    fontWeight: 600,
    textAlign: 'center',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  primaryCtaDisabled: {
    flex: 1,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#8a849a',
    padding: '0.55rem 0.8rem',
    borderRadius: '10px',
    fontSize: '0.78rem',
    textAlign: 'center'
  },
  editBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#8a849a',
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteBtn: {
    background: 'rgba(212,96,122,0.1)',
    border: '1px solid rgba(212,96,122,0.25)',
    color: '#d4607a',
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default ProductCard;