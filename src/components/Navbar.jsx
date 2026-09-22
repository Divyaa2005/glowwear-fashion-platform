import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SaveProductModal from './SaveProductModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleSaveClick = () => {
    if (!user) {
      navigate('/login?redirect=save');
      return;
    }
    setShowSaveModal(true);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header style={styles.header}>
        <div style={styles.navInner}>
          
          {/* Brand */}
          <div style={styles.brandGroup}>
            <Link to="/" style={styles.logo}>
              GlowWear <span style={styles.star}>✦</span>
            </Link>
            <span style={styles.badge}>2.0</span>
          </div>

          {/* Desktop Nav Links */}
          <nav style={styles.desktopLinks}>
            {user ? (
              <>
                <Link to="/dashboard" style={{ ...styles.navLink, color: isActive('/dashboard') ? '#c9a84c' : '#ffffff' }}>
                  Dashboard
                </Link>
                <Link to="/collections" style={{ ...styles.navLink, color: isActive('/collections') ? '#c9a84c' : '#ffffff' }}>
                  Collections
                </Link>
                <Link to="/wishlist" style={{ ...styles.navLink, color: isActive('/wishlist') ? '#d4607a' : '#ffffff' }}>
                  ❤️ Wishlist
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" style={{ ...styles.navLink, color: isActive('/admin') ? '#c9a84c' : '#8a849a' }}>
                    ⚙️ Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/" style={{ ...styles.navLink, color: isActive('/') ? '#c9a84c' : '#ffffff' }}>
                  Home
                </Link>
                <a href="#how-it-works" style={styles.navLink}>
                  How It Works
                </a>
              </>
            )}
          </nav>

          {/* Right Action Group */}
          <div style={styles.rightGroup}>
            
            {/* Prominent + Save Product button */}
            <button style={styles.saveProductBtn} onClick={handleSaveClick}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>+</span> Save Product
            </button>

            {user ? (
              <div style={styles.userControls}>
                <Link to="/profile" style={styles.profileBtn} title="My Profile">
                  👤 <span style={styles.userName}>{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
                  Logout
                </button>
              </div>
            ) : (
              <div style={styles.authBtns}>
                <Link to="/login" style={styles.loginBtn}>Login</Link>
                <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              style={styles.mobileHamburger}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>

          </div>

        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div style={styles.mobileDrawer}>
            {user ? (
              <>
                <div style={styles.mobileUserHeader}>
                  Signed in as <strong>{user.name}</strong> ({user.email})
                </div>
                <Link to="/dashboard" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                  📊 Dashboard
                </Link>
                <Link to="/collections" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                  📁 My Collections
                </Link>
                <Link to="/wishlist" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                  ❤️ Wishlist
                </Link>
                <Link to="/profile" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                  👤 Account Profile
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                    ⚙️ Admin Analytics
                  </Link>
                )}
                <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/login" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                  Create Account
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Spacer so content doesn't get covered by fixed header */}
      <div style={{ height: '72px' }} />

      {/* Save Product Modal */}
      <SaveProductModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onProductSaved={() => {
          if (location.pathname === '/dashboard' || location.pathname === '/collections' || location.pathname === '/wishlist') {
            window.location.reload();
          } else {
            navigate('/dashboard');
          }
        }}
      />
    </>
  );
};

const styles = {
  header: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    background: 'rgba(10,9,13,0.96)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  navInner: {
    maxWidth: '1360px',
    margin: '0 auto',
    padding: '0.85rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem'
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  logo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.65rem',
    fontWeight: 600,
    color: '#ffffff',
    textDecoration: 'none',
    letterSpacing: '1px'
  },
  star: {
    color: '#c9a84c'
  },
  badge: {
    fontSize: '0.62rem',
    fontWeight: 700,
    background: 'rgba(201,168,76,0.15)',
    border: '1px solid rgba(201,168,76,0.3)',
    color: '#c9a84c',
    padding: '0.15rem 0.45rem',
    borderRadius: '50px',
    letterSpacing: '0.5px'
  },
  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.8rem',
    '@media(max-width: 768px)': {
      display: 'none'
    }
  },
  navLink: {
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    transition: 'color 0.2s',
    cursor: 'pointer'
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  },
  saveProductBtn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    border: 'none',
    padding: '0.55rem 1.1rem',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 15px rgba(201,168,76,0.25)',
    transition: 'transform 0.15s, box-shadow 0.15s'
  },
  userControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem'
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '0.45rem 0.85rem',
    borderRadius: '50px',
    fontSize: '0.8rem',
    fontWeight: 500
  },
  userName: {
    color: '#c9a84c',
    fontWeight: 600
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(212,96,122,0.3)',
    color: '#d4607a',
    padding: '0.45rem 0.85rem',
    borderRadius: '50px',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  authBtns: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem'
  },
  loginBtn: {
    color: '#8a849a',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 500,
    padding: '0.45rem 1rem',
    borderRadius: '50px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  signupBtn: {
    background: 'transparent',
    color: '#c9a84c',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    padding: '0.45rem 1rem',
    borderRadius: '50px',
    border: '1px solid rgba(201,168,76,0.3)'
  },
  mobileHamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '1.4rem',
    cursor: 'pointer',
    padding: '4px'
  },
  mobileDrawer: {
    background: '#111018',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  mobileUserHeader: {
    fontSize: '0.8rem',
    color: '#8a849a',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  },
  mobileLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '0.92rem',
    padding: '0.4rem 0'
  },
  mobileLogoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(212,96,122,0.3)',
    color: '#d4607a',
    padding: '0.6rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.4rem',
    textAlign: 'center'
  }
};

export default Navbar;