import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to GlowWear! ✨');
      if (redirectParam === 'save') {
        navigate('/dashboard?openSave=true');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
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
        <div style={styles.subtitle}>Sign in to your shopping universe</div>

        {/* ERROR */}
        {error && <div style={styles.error}>⚠ {error}</div>}

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={styles.label}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#c9a84c', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        {/* DIVIDER */}
        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine}></span>
        </div>

        {/* SIGNUP LINK */}
        <div style={styles.bottom}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>Create Free Account →</Link>
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
    maxWidth: '420px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
  },
  logo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '2rem',
    fontWeight: 600,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '0.4rem'
  },
  subtitle: {
    color: '#8a849a',
    fontSize: '0.88rem',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  error: {
    background: 'rgba(212,96,122,0.15)',
    border: '1px solid rgba(212,96,122,0.4)',
    color: '#f2839b',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    marginBottom: '1.2rem',
    textAlign: 'center'
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
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '0.85rem 1rem',
    color: '#ffffff',
    fontSize: '0.92rem',
    outline: 'none',
    fontFamily: "'Outfit', sans-serif"
  },
  btn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0.9rem',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '0.5rem',
    boxShadow: '0 4px 15px rgba(201,168,76,0.25)'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    margin: '1.5rem 0'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.07)',
    display: 'block'
  },
  dividerText: {
    color: '#8a849a',
    fontSize: '0.8rem'
  },
  bottom: {
    textAlign: 'center',
    color: '#8a849a',
    fontSize: '0.88rem'
  },
  link: {
    color: '#c9a84c',
    fontWeight: 600,
    textDecoration: 'none'
  },
  hint: {
    marginTop: '1.5rem',
    padding: '0.8rem',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    textAlign: 'center',
    color: '#8a849a',
    fontSize: '0.72rem',
    lineHeight: 1.5
  }
};

export default Login;