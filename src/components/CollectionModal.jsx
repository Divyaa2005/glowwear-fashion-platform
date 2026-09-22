import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const EMOJI_OPTIONS = ['🛍️', '👗', '👠', '💍', '👜', '🥻', '✨', '🎁', '💄', '☀️', '🌸', '🖤'];

const CollectionModal = ({ isOpen, onClose, onCollectionSaved, collection = null }) => {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🛍️');
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (collection) {
      setTitle(collection.title || '');
      setDescription(collection.description || '');
      setEmoji(collection.emoji || '🛍️');
      setIsPublic(Boolean(collection.isPublic));
    } else {
      setTitle('');
      setDescription('');
      setEmoji('🛍️');
      setIsPublic(false);
    }
  }, [collection, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning('Please provide a collection title.');
      return;
    }

    setSaving(true);
    try {
      const payload = { title: title.trim(), description: description.trim(), emoji, isPublic };
      let res;
      if (collection && collection.id) {
        res = await api.updateCollection(collection.id, payload);
        toast.success('Collection updated! ✨');
      } else {
        res = await api.createCollection(payload);
        toast.success('New collection created! ✨');
      }

      if (onCollectionSaved) onCollectionSaved(res.collection);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save collection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>{collection ? 'Edit Collection' : 'New Collection'}</div>
            <h3 style={styles.title}>{collection ? 'Update Collection' : 'Create a Collection'}</h3>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* Emoji picker */}
          <div style={styles.field}>
            <label style={styles.label}>Collection Icon</label>
            <div style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map(em => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setEmoji(em)}
                  style={{
                    ...styles.emojiBtn,
                    background: emoji === em ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.05)',
                    borderColor: emoji === em ? '#c9a84c' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div style={styles.field}>
            <label style={styles.label}>Collection Title *</label>
            <input
              type="text"
              placeholder="e.g. Wedding Outfits, Summer Vibe, Under ₹2000"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>Description (Optional)</label>
            <textarea
              placeholder="Describe what goes into this collection..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{ ...styles.input, resize: 'vertical' }}
            />
          </div>

          {/* Visibility Toggle */}
          <div style={styles.visibilityCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="isPublicToggle"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <label htmlFor="isPublicToggle" style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                  Make this collection Public & Shareable
                </label>
                <div style={{ color: '#8a849a', fontSize: '0.78rem', marginTop: '2px' }}>
                  Generates a link you can share with friends. Anyone with the link can view (read-only).
                </div>
              </div>
            </div>
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={saving} style={styles.saveBtn}>
              {saving ? 'Saving...' : collection ? 'Update Collection' : 'Create Collection ✦'}
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
    maxWidth: '520px',
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
    borderRadius: '12px',
    padding: '0.8rem 1rem',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: "'Outfit', sans-serif"
  },
  emojiGrid: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  emojiBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '1px solid',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  visibilityCard: {
    background: '#111018',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '14px',
    padding: '1rem',
    marginTop: '0.4rem'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.8rem',
    marginTop: '0.5rem'
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

export default CollectionModal;
