import React from 'react';

const PriceHistoryModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const history = Array.isArray(product.priceHistory) && product.priceHistory.length > 0
    ? product.priceHistory
    : [{ price: product.price, date: product.createdAt }];

  const initialPrice = history[0].price;
  const currentPrice = product.price;
  const priceDifference = initialPrice - currentPrice;
  const isDrop = priceDifference > 0;
  const dropPercentage = isDrop ? Math.round((priceDifference / initialPrice) * 100) : 0;

  // Compute min and max for SVG visual chart
  const prices = history.map(h => h.price);
  const minPrice = Math.min(...prices, product.originalPrice || product.price);
  const maxPrice = Math.max(...prices, product.originalPrice || product.price);
  const range = maxPrice - minPrice || 1;

  const chartWidth = 360;
  const chartHeight = 120;
  const padding = 20;

  const points = history.map((item, index) => {
    const x = padding + (index / Math.max(history.length - 1, 1)) * (chartWidth - padding * 2);
    const normalizedY = (item.price - minPrice) / range;
    const y = chartHeight - padding - normalizedY * (chartHeight - padding * 2);
    return { x, y, price: item.price, date: item.date };
  });

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Price Tracking & History</div>
            <h3 style={styles.title}>{product.title}</h3>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Price Drop Banner */}
        {isDrop ? (
          <div style={styles.dropBanner}>
            <span style={{ fontSize: '1.4rem' }}>🎉</span>
            <div>
              <div style={{ fontWeight: 700, color: '#5bb580', fontSize: '0.95rem' }}>
                Price dropped by ₹{priceDifference} ({dropPercentage}% OFF)
              </div>
              <div style={{ fontSize: '0.8rem', color: '#8a849a' }}>
                Previous: ₹{initialPrice} · Current: ₹{currentPrice}
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.stableBanner}>
            <span style={{ fontSize: '1.2rem' }}>📊</span>
            <div>
              <div style={{ fontWeight: 600, color: '#c9a84c', fontSize: '0.88rem' }}>Current Price: ₹{currentPrice}</div>
              <div style={{ fontSize: '0.78rem', color: '#8a849a' }}>No price drops recorded yet.</div>
            </div>
          </div>
        )}

        {/* Visual Chart */}
        <div style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <span style={{ fontSize: '0.72rem', color: '#8a849a', textTransform: 'uppercase' }}>Price Trend</span>
            <span style={{ fontSize: '0.75rem', color: '#c9a84c', fontWeight: 600 }}>Highest: ₹{maxPrice} · Lowest: ₹{minPrice}</span>
          </div>

          <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: 'visible' }}>
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.07)" strokeDasharray="3,3" />
            <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.07)" strokeDasharray="3,3" />
            
            {points.length > 1 && (
              <polyline
                fill="none"
                stroke="#c9a84c"
                strokeWidth="2.5"
                points={polylineStr}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill={i === points.length - 1 ? '#5bb580' : '#c9a84c'} />
                <text x={p.x} y={p.y - 10} fill="#ffffff" fontSize="10" textAnchor="middle" fontFamily="'Outfit', sans-serif">
                  ₹{p.price}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Timeline Log */}
        <div style={styles.timeline}>
          <div style={styles.timelineTitle}>History Log</div>
          {history.map((entry, idx) => (
            <div key={idx} style={styles.timelineItem}>
              <div style={styles.timelineDot} />
              <div style={styles.timelineContent}>
                <div style={styles.timelinePrice}>₹{entry.price}</div>
                <div style={styles.timelineDate}>
                  {new Date(entry.date).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                  {idx === history.length - 1 ? ' · Current' : idx === 0 ? ' · Initial Price' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
          <button style={styles.doneBtn} onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(10,9,13,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1.5rem'
  },
  modal: {
    backgroundColor: '#18161f',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    maxWidth: '480px',
    width: '100%',
    padding: '2rem',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
    animation: 'fadeIn 0.2s ease-out'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem'
  },
  eyebrow: {
    fontSize: '0.7rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '0.3rem'
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.4rem',
    color: '#ffffff',
    lineHeight: 1.3
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#8a849a',
    fontSize: '1.4rem',
    cursor: 'pointer'
  },
  dropBanner: {
    background: 'rgba(91,181,128,0.12)',
    border: '1px solid rgba(91,181,128,0.3)',
    borderRadius: '14px',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '1.5rem'
  },
  stableBanner: {
    background: 'rgba(201,168,76,0.08)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '14px',
    padding: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '1.5rem'
  },
  chartContainer: {
    background: '#111018',
    borderRadius: '16px',
    padding: '1.2rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  timelineTitle: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#8a849a',
    marginBottom: '4px'
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  timelineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#c9a84c'
  },
  timelineContent: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '6px'
  },
  timelinePrice: {
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.88rem'
  },
  timelineDate: {
    color: '#8a849a',
    fontSize: '0.78rem'
  },
  doneBtn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0.6rem 1.6rem',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer'
  }
};

export default PriceHistoryModal;
