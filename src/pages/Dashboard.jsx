import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import SaveProductModal from '../components/SaveProductModal';
import CollectionModal from '../components/CollectionModal';

const Dashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalCollections: 0,
    totalWishlist: 0,
    totalWishlistValue: 0,
    priceDropCount: 0,
    priceDropItems: [],
    statusCounts: { saved: 0, toBuy: 0, purchased: 0 },
    userTags: []
  });

  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('all'); // all | saved | to-buy | purchased | price-drops
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showColModal, setShowColModal] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [metricsRes, productsRes, collectionsRes] = await Promise.all([
        api.getMetrics(),
        api.getProducts({
          search: search.trim(),
          status: statusTab === 'all' || statusTab === 'price-drops' ? undefined : statusTab,
          platform: selectedPlatform || undefined,
          category: selectedCategory || undefined,
          collectionId: selectedCollection || undefined,
          tag: selectedTag || undefined,
          sort: sortBy
        }),
        api.getCollections()
      ]);

      if (metricsRes.success) setMetrics(metricsRes.metrics);
      if (collectionsRes.success) setCollections(collectionsRes.collections);

      if (productsRes.success) {
        let items = productsRes.products;
        if (statusTab === 'price-drops') {
          items = items.filter(p => p.priceHistory && p.priceHistory.length > 1 && p.price < p.priceHistory[0].price);
        }
        setProducts(items);
      }
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [search, statusTab, selectedPlatform, selectedCategory, selectedCollection, selectedTag, sortBy, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleProductUpdated = () => {
    fetchDashboardData();
  };

  const handleProductDeleted = (deletedId) => {
    setProducts(prev => prev.filter(p => p.id !== deletedId));
    api.getMetrics().then(res => { if (res.success) setMetrics(res.metrics); });
  };

  const clearAllFilters = () => {
    setSearch('');
    setStatusTab('all');
    setSelectedPlatform('');
    setSelectedCategory('');
    setSelectedCollection('');
    setSelectedTag('');
    setSortBy('newest');
  };

  const hasActiveFilters = Boolean(search || statusTab !== 'all' || selectedPlatform || selectedCategory || selectedCollection || selectedTag);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* Welcome Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Personal Shopping Command Center</div>
            <h1 style={styles.title}>
              Welcome back, <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>{user?.name || 'Shopper'}</em> 👋
            </h1>
            <p style={styles.sub}>
              Organize your finds across the web, monitor prices, and share collections.
            </p>
          </div>

          <div style={styles.headerActions}>
            <button style={styles.btnSecondary} onClick={() => setShowColModal(true)}>
              📁 + New Collection
            </button>
            <button style={styles.btnPrimary} onClick={() => setShowSaveModal(true)}>
              + Save Product ✦
            </button>
          </div>
        </div>

        {/* ── KPI METRICS CARDS ── */}
        <div style={styles.metricsGrid}>
          
          <div style={styles.metricCard}>
            <div style={styles.metricIcon}>🛍️</div>
            <div style={styles.metricVal}>{metrics.totalProducts}</div>
            <div style={styles.metricLbl}>Saved Items</div>
            <div style={styles.metricSub}>{metrics.statusCounts.purchased} already purchased</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricIcon}>📁</div>
            <div style={styles.metricVal}>{metrics.totalCollections}</div>
            <div style={styles.metricLbl}>Collections</div>
            <Link to="/collections" style={styles.metricLink}>View all collections →</Link>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricIcon}>❤️</div>
            <div style={styles.metricVal}>₹{metrics.totalWishlistValue.toLocaleString('en-IN')}</div>
            <div style={styles.metricLbl}>Wishlist Value</div>
            <div style={styles.metricSub}>{metrics.totalWishlist} wishlist items</div>
          </div>

          <div style={{ ...styles.metricCard, borderColor: metrics.priceDropCount > 0 ? 'rgba(91,181,128,0.4)' : 'rgba(255,255,255,0.08)' }}>
            <div style={styles.metricIcon}>📉</div>
            <div style={{ ...styles.metricVal, color: metrics.priceDropCount > 0 ? '#5bb580' : '#ffffff' }}>
              {metrics.priceDropCount}
            </div>
            <div style={styles.metricLbl}>Price Drops Detected</div>
            {metrics.priceDropCount > 0 ? (
              <button
                style={styles.priceDropBtn}
                onClick={() => setStatusTab('price-drops')}
              >
                View Price Drops →
              </button>
            ) : (
              <div style={styles.metricSub}>Tracking historical prices</div>
            )}
          </div>

        </div>

        {/* ── STATUS TABS ── */}
        <div style={styles.tabsRow}>
          {[
            { id: 'all', label: 'All Items', count: metrics.totalProducts },
            { id: 'saved', label: '💖 Saved', count: metrics.statusCounts.saved },
            { id: 'to-buy', label: '🛍️ To Buy', count: metrics.statusCounts.toBuy },
            { id: 'purchased', label: '✅ Purchased', count: metrics.statusCounts.purchased },
            { id: 'price-drops', label: '🎉 Price Drops', count: metrics.priceDropCount }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              style={{
                ...styles.tabBtn,
                background: statusTab === tab.id ? '#c9a84c' : 'rgba(255,255,255,0.04)',
                color: statusTab === tab.id ? '#0a090d' : '#8a849a',
                borderColor: statusTab === tab.id ? '#c9a84c' : 'rgba(255,255,255,0.08)'
              }}
            >
              {tab.label} <span style={styles.tabBadge}>({tab.count || 0})</span>
            </button>
          ))}
        </div>

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div style={styles.filterBar}>
          
          {/* Search box */}
          <div style={styles.searchBox}>
            <span style={{ color: '#8a849a' }}>🔍</span>
            <input
              type="text"
              placeholder="Search products, notes, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            {search && (
              <button onClick={() => setSearch('')} style={styles.clearBtn}>✕</button>
            )}
          </div>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Platforms</option>
            <option value="Myntra">Myntra</option>
            <option value="Flipkart">Flipkart</option>
            <option value="Amazon">Amazon</option>
            <option value="AJIO">AJIO</option>
            <option value="Meesho">Meesho</option>
            <option value="Nykaa">Nykaa</option>
            <option value="Other">Other</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Categories</option>
            <option value="dresses">Dresses</option>
            <option value="shoes">Shoes</option>
            <option value="makeup">Makeup</option>
            <option value="bags">Bags</option>
            <option value="jewellery">Jewellery</option>
            <option value="ethnic">Ethnic Wear</option>
            <option value="tops">Tops & Shirts</option>
          </select>

          {/* Collection Filter */}
          <select
            value={selectedCollection}
            onChange={e => setSelectedCollection(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Collections</option>
            {collections.map(c => (
              <option key={c.id} value={c.id}>{c.emoji} {c.title}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="newest">Newest Added</option>
            <option value="oldest">Oldest Added</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>

          {hasActiveFilters && (
            <button onClick={clearAllFilters} style={styles.resetBtn}>
              Reset Filters ✕
            </button>
          )}

        </div>

        {/* ── TAG CHIPS ── */}
        {metrics.userTags && metrics.userTags.length > 0 && (
          <div style={styles.tagChips}>
            <span style={{ fontSize: '0.75rem', color: '#8a849a', textTransform: 'uppercase', marginRight: '6px' }}>
              Filter by Tag:
            </span>
            {metrics.userTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                style={{
                  ...styles.tagChip,
                  background: selectedTag === tag ? '#c9a84c' : 'rgba(201,168,76,0.1)',
                  color: selectedTag === tag ? '#0a090d' : '#c9a84c',
                  fontWeight: selectedTag === tag ? 700 : 500
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* ── PRODUCT GRID OR EMPTY STATE ── */}
        {loading ? (
          <div style={styles.loadingBox}>
            <div style={{ fontSize: '2rem', animation: 'spin 1s infinite linear' }}>✦</div>
            <p style={{ color: '#8a849a', marginTop: '1rem' }}>Loading your shopping universe...</p>
          </div>
        ) : products.length > 0 ? (
          <div style={styles.productGrid}>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onUpdated={handleProductUpdated}
                onDeleted={handleProductDeleted}
                onTagClick={tag => setSelectedTag(tag)}
              />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>
              {hasActiveFilters ? '🔍' : '✨'}
            </div>
            <h3 style={styles.emptyTitle}>
              {hasActiveFilters ? 'No matching products found' : 'Your wardrobe is waiting ✨'}
            </h3>
            <p style={styles.emptySub}>
              {hasActiveFilters
                ? 'Try broadening your search or resetting active filters.'
                : 'Find outfits, shoes, or jewellery across Myntra, Flipkart, Amazon, AJIO or Meesho and save them here!'}
            </p>
            {hasActiveFilters ? (
              <button onClick={clearAllFilters} style={styles.btnSecondary}>
                Clear All Filters
              </button>
            ) : (
              <button onClick={() => setShowSaveModal(true)} style={styles.btnPrimary}>
                + Save Your First Product ✦
              </button>
            )}
          </div>
        )}

      </div>

      {/* Modals */}
      <SaveProductModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onProductSaved={fetchDashboardData}
      />

      <CollectionModal
        isOpen={showColModal}
        onClose={() => setShowColModal(false)}
        onCollectionSaved={fetchDashboardData}
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
  btnPrimary: {
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
  btnSecondary: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#ffffff',
    padding: '0.8rem 1.4rem',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.88rem',
    cursor: 'pointer'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.2rem',
    marginBottom: '2.5rem'
  },
  metricCard: {
    background: '#14121a',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '1.6rem',
    position: 'relative'
  },
  metricIcon: {
    fontSize: '1.8rem',
    marginBottom: '0.6rem'
  },
  metricVal: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '2.2rem',
    fontWeight: 600,
    color: '#c9a84c',
    lineHeight: 1
  },
  metricLbl: {
    fontSize: '0.75rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#ffffff',
    marginTop: '0.4rem',
    fontWeight: 600
  },
  metricSub: {
    fontSize: '0.75rem',
    color: '#8a849a',
    marginTop: '0.4rem'
  },
  metricLink: {
    fontSize: '0.75rem',
    color: '#c9a84c',
    textDecoration: 'none',
    marginTop: '0.4rem',
    display: 'inline-block'
  },
  priceDropBtn: {
    background: 'none',
    border: 'none',
    color: '#5bb580',
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: 0,
    marginTop: '0.4rem',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  tabsRow: {
    display: 'flex',
    gap: '0.6rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem',
    marginBottom: '1.5rem',
    whiteSpace: 'nowrap'
  },
  tabBtn: {
    border: '1px solid',
    padding: '0.6rem 1.2rem',
    borderRadius: '50px',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  tabBadge: {
    opacity: 0.8,
    fontSize: '0.75rem'
  },
  filterBar: {
    background: '#14121a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '0.8rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem'
  },
  searchBox: {
    flex: 1,
    minWidth: '220px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#18161f',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '0.5rem 0.8rem'
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.85rem',
    outline: 'none',
    width: '100%',
    fontFamily: "'Outfit', sans-serif"
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#8a849a',
    cursor: 'pointer',
    padding: '2px'
  },
  filterSelect: {
    background: '#18161f',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#ffffff',
    borderRadius: '10px',
    padding: '0.55rem 0.8rem',
    fontSize: '0.82rem',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif"
  },
  resetBtn: {
    background: 'transparent',
    border: 'none',
    color: '#d4607a',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0.5rem'
  },
  tagChips: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '2rem'
  },
  tagChip: {
    border: 'none',
    padding: '0.3rem 0.7rem',
    borderRadius: '50px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem'
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
    maxWidth: '600px',
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

export default Dashboard;
