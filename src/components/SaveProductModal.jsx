import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const PLATFORMS = ['Myntra', 'Flipkart', 'Amazon', 'AJIO', 'Meesho', 'Nykaa', 'Zara', 'H&M', 'Other'];
const CATEGORIES = [
  { id: 'dresses', label: 'Dresses' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'bags', label: 'Bags' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'ethnic', label: 'Ethnic Wear' },
  { id: 'tops', label: 'Tops & Shirts' },
  { id: 'other', label: 'Other' }
];

const SaveProductModal = ({ isOpen, onClose, onProductSaved, initialCollectionId = '' }) => {
  const toast = useToast();
  const [url, setUrl] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [manualNotice, setManualNotice] = useState('');

  const [form, setForm] = useState({
    title: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    platform: 'Myntra',
    category: 'dresses',
    collectionId: initialCollectionId || '',
    status: 'saved',
    tags: '',
    notes: '',
    isWishlisted: true
  });

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api.getCollections()
        .then(res => {
          if (res.success) {
            setCollections(res.collections);
            if (initialCollectionId) {
              setForm(prev => ({ ...prev, collectionId: initialCollectionId }));
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen, initialCollectionId]);

  if (!isOpen) return null;

  const handleExtract = async (e) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      toast.warning('Please enter a product URL first.');
      return;
    }

    setExtracting(true);
    setDuplicateWarning(null);
    setManualNotice('');

    try {
      // 1. Check for duplicates
      const dupRes = await api.checkDuplicate(url.trim());
      if (dupRes.isDuplicate) {
        setDuplicateWarning(dupRes.product);
      }

      // 2. Fetch metadata
      const res = await api.extractUrlMetadata(url.trim());
      if (res.extracted) {
        const ext = res.extracted;
        setForm(prev => ({
          ...prev,
          title: ext.title || prev.title,
          price: ext.price || prev.price,
          originalPrice: ext.originalPrice || ext.price || prev.originalPrice,
          imageUrl: ext.imageUrl || prev.imageUrl,
          platform: ext.platform || prev.platform,
          category: ext.category || prev.category
        }));

        if (res.needsManualInput) {
          setManualNotice(res.message || 'Please confirm or fill in any missing details.');
        } else {
          toast.success(res.message || 'Product details fetched! ✨');
        }
      }
    } catch (err) {
      setManualNotice('Automatic extraction was unavailable for this link. You can enter details manually.');
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() && !url.trim()) {
      toast.error('Please provide at least a title or URL.');
      return;
    }

    setSaving(true);
    try {
      const tagArray = form.tags
        ? form.tags
            .split(/[\s,]+/)
            .map(t => t.trim())
            .filter(Boolean)
            .map(t => t.startsWith('#') ? t : '#' + t)
        : [];

      const payload = {
        ...form,
        url: url.trim(),
        price: Number(form.price) || 0,
        originalPrice: Number(form.originalPrice) || Number(form.price) || 0,
        tags: tagArray
      };

      const res = await api.createProduct(payload);
      if (res.isDuplicate) {
        toast.info(res.message || 'You already saved this item!');
        setDuplicateWarning(res.existingProduct);
      } else {
        toast.success('Product saved to your collection! ✨');
        if (onProductSaved) onProductSaved(res.product);
        handleClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setDuplicateWarning(null);
    setManualNotice('');
    setForm({
      title: '',
      price: '',
      originalPrice: '',
      imageUrl: '',
      platform: 'Myntra',
      category: 'dresses',
      collectionId: '',
      status: 'saved',
      tags: '',
      notes: '',
      isWishlisted: true
    });
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Universal Product Saver</div>
            <h2 style={styles.title}>Save to <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>GlowWear</em></h2>
          </div>
          <button style={styles.closeBtn} onClick={handleClose}>✕</button>
        </div>

        {/* URL Input Form */}
        <div style={styles.urlSection}>
          <label style={styles.label}>Paste Product URL</label>
          <div style={styles.urlBar}>
            <input
              type="url"
              placeholder="https://www.myntra.com/... or Flipkart, Amazon, AJIO..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              style={styles.urlInput}
            />
            <button
              type="button"
              onClick={handleExtract}
              disabled={extracting}
              style={styles.fetchBtn}
            >
              {extracting ? 'Fetching...' : 'Auto-Fetch ⚡'}
            </button>
          </div>
        </div>

        {/* Duplicate Warning */}
        {duplicateWarning && (
          <div style={styles.duplicateBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>❤️</span>
              <div>
                <strong>You already saved this product!</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{duplicateWarning.title} (₹{duplicateWarning.price})</div>
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#c9a84c' }}>
              You can still edit details or assign it to a different collection below.
            </div>
          </div>
        )}

        {/* Manual Notice fallback */}
        {manualNotice && (
          <div style={styles.manualNotice}>
            <span>ℹ️</span> {manualNotice}
          </div>
        )}

        {/* Details Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>

            {/* Title */}
            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Product Name *</label>
              <input
                type="text"
                placeholder="e.g. Floral Wrap Midi Dress"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            {/* Price */}
            <div style={styles.field}>
              <label style={styles.label}>Current Price (₹) *</label>
              <input
                type="number"
                placeholder="499"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            {/* Original Price */}
            <div style={styles.field}>
              <label style={styles.label}>Original Price / MRP (₹)</label>
              <input
                type="number"
                placeholder="1499"
                value={form.originalPrice}
                onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                style={styles.input}
              />
            </div>

            {/* Platform */}
            <div style={styles.field}>
              <label style={styles.label}>Shopping Platform</label>
              <select
                value={form.platform}
                onChange={e => setForm({ ...form, platform: e.target.value })}
                style={styles.select}
              >
                {PLATFORMS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div style={styles.field}>
              <label style={styles.label}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={styles.select}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Product Image URL</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  style={{ ...styles.input, flex: 1 }}
                />
                {form.imageUrl && (
                  <div style={styles.previewThumb}>
                    <img src={form.imageUrl} alt="preview" style={styles.thumbImg} onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
            </div>

            {/* Target Collection */}
            <div style={styles.field}>
              <label style={styles.label}>Assign to Collection</label>
              <select
                value={form.collectionId}
                onChange={e => setForm({ ...form, collectionId: e.target.value })}
                style={styles.select}
              >
                <option value="">(No specific collection)</option>
                {collections.map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.title}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div style={styles.field}>
              <label style={styles.label}>Shopping Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                style={styles.select}
              >
                <option value="saved">💖 Saved</option>
                <option value="to-buy">🛍️ Planning to Buy</option>
                <option value="purchased">✅ Purchased</option>
              </select>
            </div>

            {/* Tags */}
            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Tags (comma or space separated)</label>
              <input
                type="text"
                placeholder="#partywear, #under2000, #black, #wedding"
                value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
                style={styles.input}
              />
            </div>

            {/* Personal Notes */}
            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Personal Notes</label>
              <textarea
                placeholder="e.g. Size M fits best; buy during Diwali sale; matches my silver earrings."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={2}
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </div>

            {/* Wishlist checkbox */}
            <div style={{ ...styles.field, gridColumn: '1 / -1', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="modal-wishlist"
                checked={form.isWishlisted}
                onChange={e => setForm({ ...form, isWishlisted: e.target.checked })}
                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
              />
              <label htmlFor="modal-wishlist" style={{ color: '#ffffff', fontSize: '0.88rem', cursor: 'pointer' }}>
                ❤️ Also include in Universal Wishlist
              </label>
            </div>

          </div>

          <div style={styles.actions}>
            <button type="button" onClick={handleClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={styles.saveBtn}>
              {saving ? 'Saving...' : 'Save Product ✦'}
            </button>
          </div>
        </form>

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
    padding: '1.5rem',
    overflowY: 'auto'
  },
  modal: {
    backgroundColor: '#18161f',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    maxWidth: '680px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
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
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '0.3rem'
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.8rem',
    fontWeight: 400,
    color: '#ffffff'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#8a849a',
    fontSize: '1.4rem',
    cursor: 'pointer',
    padding: '4px'
  },
  urlSection: {
    background: '#111018',
    border: '1px solid rgba(201,168,76,0.25)',
    borderRadius: '16px',
    padding: '1.2rem',
    marginBottom: '1.5rem'
  },
  urlBar: {
    display: 'flex',
    gap: '0.6rem',
    marginTop: '0.4rem'
  },
  urlInput: {
    flex: 1,
    background: '#18161f',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    color: '#ffffff',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: "'Outfit', sans-serif"
  },
  fetchBtn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0 1.2rem',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  duplicateBox: {
    background: 'rgba(212,96,122,0.12)',
    border: '1px solid rgba(212,96,122,0.4)',
    borderRadius: '12px',
    padding: '0.9rem 1.2rem',
    color: '#ffffff',
    marginBottom: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  manualNotice: {
    background: 'rgba(201,168,76,0.1)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    color: '#e8cb80',
    fontSize: '0.82rem',
    marginBottom: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.72rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: '#8a849a',
    fontWeight: 500
  },
  input: {
    background: '#111018',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    color: '#ffffff',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: "'Outfit', sans-serif"
  },
  select: {
    background: '#111018',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    color: '#ffffff',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: "'Outfit', sans-serif"
  },
  previewThumb: {
    width: '42px',
    height: '42px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
    flexShrink: 0
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.8rem',
    marginTop: '1rem',
    paddingTop: '1.2rem',
    borderTop: '1px solid rgba(255,255,255,0.07)'
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#8a849a',
    padding: '0.75rem 1.4rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0.75rem 1.8rem',
    borderRadius: '12px',
    fontSize: '0.88rem',
    fontWeight: 700,
    cursor: 'pointer'
  }
};

export default SaveProductModal;
