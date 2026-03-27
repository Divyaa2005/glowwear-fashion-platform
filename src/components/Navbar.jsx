import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      {/* LOGO */}
      <Link to="/" style={styles.logo}>
        GlowWear <span style={styles.star}>✦</span>
      </Link>

      {/* DESKTOP LINKS */}
      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/category/dresses" style={styles.link}>Dresses</Link></li>
        <li><Link to="/category/shoes" style={styles.link}>Shoes</Link></li>
        <li><Link to="/category/makeup" style={styles.link}>Makeup</Link></li>
        <li><Link to="/category/bags" style={styles.link}>Bags</Link></li>
        <li><Link to="/category/jewellery" style={styles.link}>Jewellery</Link></li>
        <li><Link to="/category/ethnic" style={styles.link}>Ethnic</Link></li>
      </ul>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        {user ? (
          <>
            <Link to="/wishlist" style={styles.wishBtn}>❤️ Wishlist</Link>
            <div style={styles.userInfo}>
              <span style={styles.userName}>Hi, {user.name.split(' ')[0]}!</span>
              {user.email === 'admin@glowwear.com' && (
                <Link to="/admin" style={styles.adminBtn}>⚙️ Admin</Link>
              )}
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.loginBtn}>Login</Link>
            <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
          </>
        )}

        {/* MOBILE MENU */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {['dresses','shoes','makeup','bags','jewellery','ethnic','tops'].map(cat => (
            <Link
              key={cat}
              to={`/category/${cat}`}
              style={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}
          <Link to="/wishlist" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>❤️ Wishlist</Link>
          {!user ? (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          ) : (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={styles.mobileLink}>
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 2.5rem',
    background: 'rgba(10,9,13,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    flexWrap: 'wrap', gap: '0.5rem',
  },
  logo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.7rem', fontWeight: 600,
    color: '#ffffff', textDecoration: 'none',
    letterSpacing: '1px',
  },
  star: { color: '#c9a84c' },
  links: {
    display: 'flex', gap: '2rem', listStyle: 'none',
    '@media(max-width:768px)': { display: 'none' },
  },
  link: {
    color: '#8a849a', textDecoration: 'none',
    fontSize: '0.82rem', fontWeight: 500,
    letterSpacing: '1px', textTransform: 'uppercase',
    transition: 'color 0.2s',
  },
  right: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
  wishBtn: {
    color: '#d4607a', textDecoration: 'none',
    fontSize: '0.85rem', fontWeight: 600,
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  userName: { color: '#c9a84c', fontSize: '0.85rem', fontWeight: 600 },
  adminBtn: {
    background: 'rgba(201,168,76,0.15)',
    border: '1px solid rgba(201,168,76,0.4)',
    color: '#c9a84c', padding: '0.35rem 0.9rem',
    borderRadius: '50px', fontSize: '0.78rem',
    fontWeight: 600, textDecoration: 'none',
  },
  loginBtn: {
    color: '#8a849a', textDecoration: 'none',
    fontSize: '0.85rem', fontWeight: 500,
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '0.45rem 1.2rem', borderRadius: '50px',
    transition: 'all 0.2s',
  },
  signupBtn: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d', padding: '0.45rem 1.2rem',
    borderRadius: '50px', fontSize: '0.85rem',
    fontWeight: 600, textDecoration: 'none',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(212,96,122,0.4)',
    color: '#d4607a', padding: '0.35rem 0.9rem',
    borderRadius: '50px', fontSize: '0.78rem',
    fontWeight: 600, cursor: 'pointer',
  },
  hamburger: {
    display: 'none',
    background: 'transparent', border: 'none',
    color: '#ffffff', fontSize: '1.4rem', cursor: 'pointer',
    '@media(max-width:768px)': { display: 'block' },
  },
  mobileMenu: {
    width: '100%', display: 'flex', flexDirection: 'column',
    gap: '0.5rem', padding: '1rem 0',
    borderTop: '1px solid rgba(255,255,255,0.07)',
  },
  mobileLink: {
    color: '#8a849a', textDecoration: 'none',
    fontSize: '0.9rem', padding: '0.5rem 0',
    background: 'transparent', border: 'none',
    textAlign: 'left', cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
  },
};

export default Navbar;