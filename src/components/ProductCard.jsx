import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { user, toggleWishlist, isWishlisted } = useAuth();
  const wishlisted = isWishlisted(product.id);
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div style={styles.card}>

      <div style={styles.imgBox}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={styles.img} />
        ) : (
          <span style={styles.emoji}>{product.emoji}</span>
        )}
        <span style={styles.badge}>{discount}% OFF</span>
        <button
          style={{
            ...styles.wishBtn,
            background: wishlisted ? 'rgba(212,96,122,0.25)' : 'rgba(255,255,255,0.07)',
            borderColor: wishlisted ? '#d4607a' : 'rgba(255,255,255,0.1)',
          }}
          onClick={() => {
            if (!user) {
              alert('Please login to save wishlist!');
              return;
            }
            toggleWishlist(product.id);
          }}
        >
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>

      <div style={styles.body}>
        <div style={styles.source}>— {product.source}</div>
        <div style={styles.name}>{product.name}</div>
        <div style={styles.type}>{product.type}</div>

        <div style={styles.priceRow}>
          <span style={styles.price}>₹{product.price}</span>
          <span style={styles.oldPrice}>₹{product.oldPrice}</span>
          <span style={styles.save}>{discount}% OFF</span>
        </div>

        <div style={styles.stars}>
          <span style={styles.starIcons}>{stars(product.stars)}</span>
          <span style={styles.reviews}>({product.reviews})</span>
        </div>

        <div style={styles.actions}>
          
          <a href={product.link}
            target="_blank"
            rel="noreferrer"
            style={styles.viewBtn}
          >
            View on {product.source} →
          </a>
          <button
            style={{
              ...styles.wishSmall,
              background: wishlisted
                ? 'rgba(212,96,122,0.2)'
                : 'transparent',
              color: wishlisted ? '#d4607a' : '#8a849a',
              borderColor: wishlisted
                ? '#d4607a'
                : 'rgba(255,255,255,0.1)',
            }}
            onClick={() => {
              if (!user) {
                alert('Please login to save wishlist!');
                return;
              }
              toggleWishlist(product.id);
            }}
          >
            {wishlisted ? '♥ Saved' : '♡ Save'}
          </button>
        </div>
      </div>

    </div>
  );
};

const styles = {
  card: {
    background: '#1e1b28',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.07)',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  imgBox: {
    height: '200px',
    background: '#18161f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  emoji: {
    fontSize: '5rem',
  },
  badge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'linear-gradient(135deg, #d4607a, #b04060)',
    color: 'white',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '0.25rem 0.6rem',
    borderRadius: '50px',
    letterSpacing: '1px',
  },
  wishBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#d4607a',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  body: {
    padding: '1.2rem 1.3rem',
  },
  source: {
    fontSize: '0.65rem',
    color: '#8a849a',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '0.4rem',
  },
  name: {
    fontWeight: 600,
    fontSize: '0.92rem',
    color: '#ffffff',
    marginBottom: '0.25rem',
    lineHeight: 1.4,
  },
  type: {
    fontSize: '0.75rem',
    color: '#8a849a',
    marginBottom: '0.8rem',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.6rem',
    marginBottom: '0.5rem',
  },
  price: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#c9a84c',
  },
  oldPrice: {
    fontSize: '0.82rem',
    color: '#8a849a',
    textDecoration: 'line-through',
  },
  save: {
    fontSize: '0.7rem',
    color: '#5bb580',
    background: 'rgba(91,181,128,0.12)',
    padding: '0.15rem 0.5rem',
    borderRadius: '50px',
    fontWeight: 600,
  },
  stars: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginBottom: '1rem',
  },
  starIcons: {
    color: '#c9a84c',
    fontSize: '0.78rem',
  },
  reviews: {
    color: '#8a849a',
    fontSize: '0.72rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  viewBtn: {
    flex: 1,
    background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08))',
    border: '1px solid rgba(201,168,76,0.3)',
    color: '#c9a84c',
    padding: '0.6rem 0.8rem',
    borderRadius: '10px',
    fontSize: '0.78rem',
    fontWeight: 600,
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  wishSmall: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#8a849a',
    padding: '0.6rem 0.8rem',
    borderRadius: '10px',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
};

export default ProductCard;