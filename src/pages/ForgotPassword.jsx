import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify and try again.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(email, newPassword);
      toast.success('Your password has been updated successfully! ✨');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to update password. Please check your email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* LOGO */}
        <div style={styles.logo}>
          GlowWear <span style={{ color: '#c9a84c' }}>✦</span>
        </div>
        <div style={styles.subtitle}>Reset Account Password</div>

        {error && <div style={styles.error}>⚠ {error}</div>}

        <p style={styles.description}>
          Enter your registered email address and choose your new password below.
        </p>

        <form onSubmit={handleResetPassword} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Registered Email Address</label>
            <input
              type="email"
              placeholder="e.g. yourname@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>New Password (min. 6 characters)</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
            />
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Updating Password...' : 'Save New Password & Sign In →'}
          </button>
        </form>

        {/* FOOTER */}
        <div style={styles.bottom}>
          Remember your password?{' '}
          <Link to="/login" style={styles.link}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
    background: '#0a090d'
  },
  card: {
    background: '#14121a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '430px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
  },
  logo: {
    fontSize: '1.75rem',
    fontWeight: 800,
    letterSpacing: '-0.5px',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '0.4rem',
    fontFamily: "'Playfair Display', serif, system-ui"
  },
  subtitle: {
    color: '#9e9bb0',
    fontSize: '0.92rem',
    textAlign: 'center',
    marginBottom: '1.25rem'
  },
  description: {
    color: '#9e9bb0',
    fontSize: '0.86rem',
    lineHeight: '1.5',
    marginBottom: '1.25rem',
    textAlign: 'center'
  },
  error: {
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    marginBottom: '1.25rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    color: '#9e9bb0',
    fontSize: '0.8rem',
    fontWeight: 500,
    letterSpacing: '0.3px',
    textTransform: 'uppercase'
  },
  input: {
    background: '#1d1a24',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '0.85rem 1rem',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    width: '100%'
  },
  btn: {
    marginTop: '0.4rem',
    padding: '0.95rem',
    background: 'linear-gradient(135deg, #c9a84c 0%, #e6ca65 100%)',
    color: '#0a090d',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.5px'
  },
  bottom: {
    marginTop: '1.75rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    textAlign: 'center',
    color: '#9e9bb0',
    fontSize: '0.88rem'
  },
  link: {
    color: '#c9a84c',
    textDecoration: 'none',
    fontWeight: 600
  }
};

export default ForgotPassword;
