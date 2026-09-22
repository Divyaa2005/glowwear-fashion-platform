import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [updatingName, setUpdatingName] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  if (!user) return null;

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setUpdatingName(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success('Display name updated successfully! ✨');
    } catch (err) {
      toast.error(err.message || 'Failed to update name.');
    } finally {
      setUpdatingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setUpdatingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password updated successfully! 🔒');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        <div style={styles.header}>
          <div style={styles.eyebrow}>Account Settings</div>
          <h1 style={styles.title}>
            Personal <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Profile</em>
          </h1>
          <p style={styles.sub}>Manage your account details and password security.</p>
        </div>

        <div style={styles.cardsGrid}>
          
          {/* Profile Details Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Profile Information</h3>
            <form onSubmit={handleUpdateName} style={styles.form}>
              
              <div style={styles.field}>
                <label style={styles.label}>Email Address (Read-only)</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  style={{ ...styles.input, opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Account Role</label>
                <div style={styles.roleBadge}>
                  {user.role} {user.role === 'ADMIN' ? '⚙️' : '✦'}
                </div>
              </div>

              <button type="submit" disabled={updatingName} style={styles.saveBtn}>
                {updatingName ? 'Saving...' : 'Save Name'}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Change Password</h3>
            <form onSubmit={handleChangePassword} style={styles.form}>
              
              <div style={styles.field}>
                <label style={styles.label}>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>New Password (Min. 6 chars)</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <button type="submit" disabled={updatingPassword} style={styles.saveBtn}>
                {updatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

        </div>

      </div>
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
    maxWidth: '960px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '2.5rem'
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
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem'
  },
  card: {
    background: '#14121a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '2rem'
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '1.5rem'
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
    background: '#18161f',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '0.8rem 1rem',
    color: '#ffffff',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: "'Outfit', sans-serif"
  },
  roleBadge: {
    background: 'rgba(201,168,76,0.12)',
    border: '1px solid rgba(201,168,76,0.3)',
    color: '#c9a84c',
    padding: '0.6rem 1rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'inline-block',
    width: 'fit-content'
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0.8rem 1.6rem',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
    marginTop: '0.5rem'
  }
};

export default Profile;
