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

const EditProductModal = ({ isOpen, onClose, product, onUpdated }) => {
  const toast = useToast();
  const [form, setForm] = useState({
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
    url: ''
  });
  const [collections, setCollections] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setForm({
        title: product.title || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        imageUrl: product.imageUrl || '',
        platform: product.platform || 'Myntra',
        category: product.category || 'dresses',
        collectionId: product.collectionId || '',
        status: product.status || 'saved',
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        notes: product.notes || '',
        url: product.url || ''
      });

      api.getCollections().then(res => {
        if (res.success) setCollections(res.collections);
      }).catch(() => {});
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tagArray = form.tags
        ? form.tags.split(/[\s,]+/).map(t => t.trim()).filter(Boolean).map(t => t.startsWith('#') ? t : '#' + t)
        : [];

      const payload = {
        ...form,
        price: Number(form.price) || 0,
        originalPrice: Number(form.originalPrice) || Number(form.price) || 0,
        tags: tagArray
      };

      const res = await api.updateProduct(product.id, payload);
      toast.success('Product updated! ✨');
      if (onUpdated) onUpdated(res.product);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Edit Product</div>
            <h3 style={styles.title}>Update Item Details</h3>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>

            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Product Name</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Original Price / MRP (₹)</label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                style={styles.input}
              />
            </div>

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

            <div style={styles.field}>
              <label style={styles.label}>Move to Collection</label>
              <select
                value={form.collectionId}
                onChange={e => setForm({ ...form, collectionId: e.target.value })}
                style={styles.select}
              >
                <option value="">(None)</option>
                {collections.map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.title}</option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Platform</label>
              <select
                value={form.platform}
                onChange={e => setForm({ ...form, platform: e.target.value })}
                style={styles.select}
              >
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={styles.select}
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Tags (comma or space separated)</label>
              <input
                type="text"
                placeholder="#partywear, #summer, #black"
                value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Personal Notes</label>
              <textarea
                placeholder="Add your thoughts or size notes..."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={2}
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </div>

          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={saving} style={styles.saveBtn}>
              {saving ? 'Updating...' : 'Save Changes'}
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
    padding: '1.5rem'
  },
  modal: {
    backgroundColor: '#18161f',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    maxWidth: '640px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '2rem',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)'
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
    fontSize: '1.6rem',
    color: '#ffffff'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#8a849a',
    fontSize: '1.4rem',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.8rem',
    marginTop: '0.5rem',
    paddingTop: '1rem',
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

export default EditProductModal;
