import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// ─── ADMIN EMAIL — change this to your email ───
const ADMIN_EMAIL = 'admin@glowwear.com';

const Admin = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    id: Date.now(),
    emoji: '👗',
    name: '',
    type: '',
    category: 'dresses',
    price: '',
    oldPrice: '',
    source: 'Myntra',
    link: '',
    image: '',
    stars: 4,
    reviews: 100,
  });
  const [saved, setSaved] = useState(false);
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem('admin_items') || '[]')
  );

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div style={styles.page}>
        <div style={styles.center}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={styles.title}>Admin Access Only</h2>
          <p style={{ color: '#8a849a', marginBottom: '2rem' }}>
            Login with admin@glowwear.com to access this page
          </p>
          <Link to="/login" style={styles.btnGold}>Login as Admin →</Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newItem = {
      ...form,
      id: Date.now(),
      price: parseInt(form.price),
      oldPrice: parseInt(form.oldPrice),
      stars: parseInt(form.stars),
      reviews: parseInt(form.reviews),
    };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem('admin_items', JSON.stringify(updated));
    setSaved(true);
    setForm({ ...form, name: '', type: '', price: '', oldPrice: '', link: '', image: '' });
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (id) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem('admin_items', JSON.stringify(updated));
  };

  return (
    <div style={styles.page}>
      <div style={styles.content}>

        <div style={styles.header}>
          <div style={styles.eyebrow}>Admin Panel</div>
          <h1 style={styles.title}>
            Add <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>New Items</em>
          </h1>
          <p style={{ color: '#8a849a', fontSize: '0.88rem' }}>
            Fill the form below — copy the output code and paste into products.js
          </p>
        </div>

        {saved && (
          <div style={styles.success}>
            ✅ Item saved! Copy the code below and paste into products.js
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSave} style={styles.form}>
          <div style={styles.formGrid}>

            <div style={styles.field}>
              <label style={styles.label}>Item Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Floral Midi Dress" style={styles.input} required />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Type *</label>
              <input name="type" value={form.type} onChange={handleChange}
                placeholder="e.g. Casual Wear" style={styles.input} required />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
                {['dresses','shoes','makeup','bags','jewellery','ethnic','tops'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Emoji</label>
              <input name="emoji" value={form.emoji} onChange={handleChange}
                placeholder="👗" style={styles.input} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Sale Price (₹) *</label>
              <input name="price" value={form.price} onChange={handleChange}
                placeholder="449" style={styles.input} type="number" required />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Original Price (₹) *</label>
              <input name="oldPrice" value={form.oldPrice} onChange={handleChange}
                placeholder="999" style={styles.input} type="number" required />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Source</label>
              <select name="source" value={form.source} onChange={handleChange} style={styles.input}>
                {['Myntra','Flipkart','Meesho','Ajio'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Stars (1-5)</label>
              <select name="stars" value={form.stars} onChange={handleChange} style={styles.input}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>

            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Product Link (Myntra/Flipkart URL) *</label>
              <input name="link" value={form.link} onChange={handleChange}
                placeholder="https://www.myntra.com/..." style={styles.input} required />
            </div>

            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Image URL (optional — leave empty for emoji)</label>
              <input name="image" value={form.image} onChange={handleChange}
                placeholder="https://..." style={styles.input} />
            </div>

          </div>

          <button type="submit" style={styles.btnGold}>
            + Save Item
          </button>
        </form>

        {/* SAVED ITEMS */}
        {items.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h2 style={{ ...styles.title, fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              Saved Items ({items.length})
            </h2>
            <p style={{ color: '#8a849a', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
              Copy this code → paste into products.js ke andar (last item ke baad)
            </p>

            {/* CODE OUTPUT */}
            <div style={styles.codeBox}>
              {items.map(item => (
                <pre key={item.id} style={styles.code}>
{`  {
    id: ${item.id},
    emoji: '${item.emoji}',
    name: '${item.name}',
    type: '${item.type}',
    category: '${item.category}',
    price: ${item.price},
    oldPrice: ${item.oldPrice},
    source: '${item.source}',
    link: '${item.link}',
    image: '${item.image}',
    stars: ${item.stars},
    reviews: ${item.reviews},
  },`}
                </pre>
              ))}
            </div>

            {/* ITEM LIST */}
            <div style={styles.itemList}>
              {items.map(item => (
                <div key={item.id} style={styles.itemRow}>
                  <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>{item.name}</div>
                    <div style={{ color: '#8a849a', fontSize: '0.75rem' }}>
                      {item.category} · ₹{item.price} · {item.source}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>
                    🗑 Delete
                  </button>
                </div>
              ))}
            </div>
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
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    textAlign: 'center',
  },
  header: { marginBottom: '2.5rem' },
  eyebrow: {
    fontSize: '0.7rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '0.5rem',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: 300,
    color: '#ffffff',
    marginBottom: '0.4rem',
  },
  success: {
    background: 'rgba(91,181,128,0.15)',
    border: '1px solid rgba(91,181,128,0.4)',
    color: '#5bb580',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    textAlign: 'center',
    fontSize: '0.88rem',
  },
  form: {
    background: '#1e1b28',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '2rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.2rem',
    marginBottom: '1.5rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.72rem',
    color: '#8a849a',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  input: {
    background: '#18161f',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    color: '#ffffff',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: "'Outfit', sans-serif",
  },
  btnGold: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0.9rem 2.5rem',
    borderRadius: '12px',
    fontSize: '0.92rem',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  codeBox: {
    background: '#111018',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    overflowX: 'auto',
  },
  code: {
    color: '#c9a84c',
    fontSize: '0.78rem',
    lineHeight: 1.6,
    fontFamily: 'monospace',
    whiteSpace: 'pre',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: '#1e1b28',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '12px',
    padding: '1rem 1.2rem',
  },
  deleteBtn: {
    background: 'rgba(212,96,122,0.1)',
    border: '1px solid rgba(212,96,122,0.3)',
    color: '#d4607a',
    padding: '0.4rem 0.9rem',
    borderRadius: '8px',
    fontSize: '0.78rem',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
  },
};

export default Admin;