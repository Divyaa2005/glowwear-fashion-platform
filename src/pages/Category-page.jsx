import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import products from '../data/products';

const categoryInfo = {
  dresses: { emoji: '👗', label: 'Dresses', sub: 'Formal · Party · Casual', filters: ['all','formal','party','casual','under499','under999'] },
  shoes:   { emoji: '👠', label: 'Shoes', sub: 'Heels · Flats · Sneakers', filters: ['all','heels','flats','sneakers','under599'] },
  makeup:  { emoji: '💄', label: 'Makeup', sub: 'Lips · Eyes · Face', filters: ['all','lips','eyes','face','under299'] },
  bags:    { emoji: '👜', label: 'Bags & Purses', sub: 'Totes · Clutches · Backpacks', filters: ['all','under499','under999'] },
  jewellery: { emoji: '💍', label: 'Jewellery', sub: 'Earrings · Necklaces · Sets', filters: ['all','under299'] },
  ethnic:  { emoji: '🥻', label: 'Ethnic Wear', sub: 'Sarees · Salwars · Lehengas', filters: ['all','under999'] },
  tops:    { emoji: '👚', label: 'Tops & Kurtis', sub: 'Ethnic · Western · Fusion', filters: ['all','under299','under499'] },
};

const filterLabels = {
  all: 'All', formal: 'Formal', party: 'Party', casual: 'Casual',
  heels: 'Heels', flats: 'Flats', sneakers: 'Sneakers',
  lips: 'Lips', eyes: 'Eyes', face: 'Face',
  under299: 'Under ₹299', under499: 'Under ₹499',
  under599: 'Under ₹599', under999: 'Under ₹999',
};

const CategoryPage = () => {
  const { category } = useParams();
  const [filter, setFilter] = useState('all');
  const info = categoryInfo[category] || { emoji: '🛍️', label: category, sub: '', filters: ['all'] };

  const catProducts = products.filter(p => p.category === category);

  const filtered = filter === 'all'
    ? catProducts
    : filter.startsWith('under')
    ? catProducts.filter(p => p.price < parseInt(filter.replace('under', '')))
    : catProducts.filter(p => p.type.toLowerCase().includes(filter));

  return (
    <div style={styles.page}>

      {/* HERO */}
      <div style={styles.hero}>
        <Link to="/" style={styles.backBtn}>← Back to Home</Link>
        <div style={styles.heroEmoji}>{info.emoji}</div>
        <h1 style={styles.heroTitle}>{info.label}</h1>
        <p style={styles.heroSub}>{info.sub}</p>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>

        {/* FILTERS */}
        <div style={styles.filters}>
          {info.filters.map(f => (
            <button
              key={f}
              style={{
                ...styles.filterBtn,
                background: filter === f ? '#c9a84c' : 'transparent',
                color: filter === f ? '#0a090d' : '#8a849a',
                borderColor: filter === f ? '#c9a84c' : 'rgba(255,255,255,0.1)',
                fontWeight: filter === f ? 700 : 500,
              }}
              onClick={() => setFilter(f)}
            >
              {filterLabels[f] || f}
            </button>
          ))}
        </div>

        {/* RESULTS COUNT */}
        <div style={styles.count}>
          Showing <span style={{ color: '#c9a84c' }}>{filtered.length}</span> items
        </div>

        {/* GRID */}
        {filtered.length > 0 ? (
          <div style={styles.grid}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div style={styles.empty}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ color: '#8a849a' }}>No items found. Try a different filter!</p>
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
  hero: {
    background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(212,96,122,0.06))',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '3rem 2rem',
    textAlign: 'center',
  },
  backBtn: {
    display: 'inline-block',
    color: '#8a849a',
    textDecoration: 'none',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
    transition: 'color 0.2s',
  },
  heroEmoji: {
    fontSize: '4rem',
    marginBottom: '0.8rem',
  },
  heroTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 300,
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  heroSub: {
    color: '#8a849a',
    fontSize: '0.9rem',
  },
  content: {
    maxWidth: '1300px',
    margin: '0 auto',
    padding: '3rem 2rem',
  },
  filters: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
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
  count: {
    color: '#8a849a',
    fontSize: '0.85rem',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
    gap: '1.5rem',
  },
  empty: {
    textAlign: 'center',
    padding: '5rem 2rem',
    color: '#8a849a',
  },
};

export default CategoryPage;