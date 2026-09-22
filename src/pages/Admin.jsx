import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Admin = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview | users | platforms

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      Promise.all([
        api.getAdminAnalytics(),
        api.getAdminUsers()
      ])
        .then(([analyticsRes, usersRes]) => {
          if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
          if (usersRes.success) setUsers(usersRes.users);
        })
        .catch(err => {
          toast.error(err.message || 'Failed to fetch admin data.');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, toast]);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div style={styles.page}>
        <div style={styles.centerBox}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={styles.title}>Admin Access Only</h2>
          <p style={{ color: '#8a849a', marginBottom: '2rem' }}>
            You need an administrator account to access this management dashboard.
          </p>
          <Link to="/login" style={styles.btnGold}>Login as Admin →</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.centerBox}>
          <div style={{ fontSize: '2.5rem', animation: 'spin 1s infinite linear' }}>✦</div>
          <p style={{ color: '#8a849a', marginTop: '1rem' }}>Loading admin analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Platform Administration</div>
            <h1 style={styles.title}>
              GlowWear <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Command Center</em>
            </h1>
            <p style={styles.sub}>
              Monitor active users, catalog ingestion, supported platforms, and overall platform growth.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div style={styles.tabGroup}>
            {['overview', 'users', 'platforms'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tabBtn,
                  background: activeTab === tab ? '#c9a84c' : 'transparent',
                  color: activeTab === tab ? '#0a090d' : '#8a849a',
                  borderColor: activeTab === tab ? '#c9a84c' : 'rgba(255,255,255,0.1)'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && analytics && (
          <div>
            {/* KPI Cards */}
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <div style={styles.kpiVal}>{analytics.totalUsers}</div>
                <div style={styles.kpiLbl}>Total Registered Users</div>
              </div>
              <div style={styles.kpiCard}>
                <div style={styles.kpiVal}>{analytics.totalProducts}</div>
                <div style={styles.kpiLbl}>Total Saved Products</div>
              </div>
              <div style={styles.kpiCard}>
                <div style={styles.kpiVal}>{analytics.totalCollections}</div>
                <div style={styles.kpiLbl}>Total Collections</div>
              </div>
              <div style={styles.kpiCard}>
                <div style={{ ...styles.kpiVal, color: '#5bb580' }}>{analytics.publicCollections}</div>
                <div style={styles.kpiLbl}>Public Shared Collections</div>
              </div>
            </div>

            {/* Platform & Category Distribution */}
            <div style={styles.distributionGrid}>
              
              {/* Platform Breakdown */}
              <div style={styles.distCard}>
                <h3 style={styles.distTitle}>Products by Shopping Platform</h3>
                <div style={styles.distList}>
                  {Object.entries(analytics.platformCounts || {}).map(([platform, count]) => {
                    const pct = analytics.totalProducts > 0
                      ? Math.round((count / analytics.totalProducts) * 100)
                      : 0;

                    return (
                      <div key={platform} style={styles.distRow}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.85rem' }}>{platform}</span>
                          <span style={{ color: '#c9a84c', fontSize: '0.82rem' }}>{count} ({pct}%)</span>
                        </div>
                        <div style={styles.barBg}>
                          <div style={{ ...styles.barFill, width: `${pct}%`, backgroundColor: '#c9a84c' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Breakdown */}
              <div style={styles.distCard}>
                <h3 style={styles.distTitle}>Products by Category</h3>
                <div style={styles.distList}>
                  {Object.entries(analytics.categoryCounts || {}).map(([category, count]) => {
                    const pct = analytics.totalProducts > 0
                      ? Math.round((count / analytics.totalProducts) * 100)
                      : 0;

                    return (
                      <div key={category} style={styles.distRow}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                            {category}
                          </span>
                          <span style={{ color: '#d4607a', fontSize: '0.82rem' }}>{count} ({pct}%)</span>
                        </div>
                        <div style={styles.barBg}>
                          <div style={{ ...styles.barFill, width: `${pct}%`, backgroundColor: '#d4607a' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div style={styles.tableCard}>
            <h3 style={styles.distTitle}>All Registered Accounts ({users.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Saved Items</th>
                    <th style={styles.th}>Collections</th>
                    <th style={styles.th}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{u.name}</strong>
                      </td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.rolePill,
                          background: u.role === 'ADMIN' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                          color: u.role === 'ADMIN' ? '#c9a84c' : '#8a849a'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={styles.td}>{u.productsCount || 0}</td>
                      <td style={styles.td}>{u.collectionsCount || 0}</td>
                      <td style={styles.td}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PLATFORMS TAB ── */}
        {activeTab === 'platforms' && (
          <div style={styles.tableCard}>
            <h3 style={styles.distTitle}>Supported Shopping Platforms</h3>
            <div style={styles.platformGrid}>
              {(analytics?.platforms || []).map(p => (
                <div key={p.id} style={styles.platformCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: p.color || '#c9a84c' }} />
                    <h4 style={{ color: '#ffffff', fontSize: '1.1rem' }}>{p.name}</h4>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#8a849a' }}>Domain: {p.domain || 'Any standard store URL'}</div>
                  <div style={{ marginTop: '0.8rem', fontSize: '0.75rem', color: '#5bb580', fontWeight: 600 }}>
                    ✓ Auto-detection & extraction enabled
                  </div>
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
    padding: '2.5rem 1.5rem 5rem'
  },
  container: {
    maxWidth: '1360px',
    margin: '0 auto'
  },
  centerBox: {
    textAlign: 'center',
    padding: '8rem 2rem',
    maxWidth: '480px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  tabGroup: {
    display: 'flex',
    gap: '0.5rem',
    background: '#14121a',
    padding: '4px',
    borderRadius: '50px',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  tabBtn: {
    border: '1px solid transparent',
    padding: '0.5rem 1.2rem',
    borderRadius: '50px',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  btnGold: {
    background: 'linear-gradient(135deg, #c9a84c, #e8cb80)',
    color: '#0a090d',
    padding: '0.85rem 1.8rem',
    borderRadius: '50px',
    fontWeight: 700,
    fontSize: '0.88rem',
    textDecoration: 'none',
    display: 'inline-block'
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.2rem',
    marginBottom: '2rem'
  },
  kpiCard: {
    background: '#14121a',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '1.8rem'
  },
  kpiVal: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '2.5rem',
    fontWeight: 600,
    color: '#c9a84c',
    lineHeight: 1
  },
  kpiLbl: {
    fontSize: '0.75rem',
    color: '#8a849a',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    marginTop: '0.5rem'
  },
  distributionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  distCard: {
    background: '#14121a',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '2rem'
  },
  distTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '1.5rem'
  },
  distList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  distRow: {
    display: 'flex',
    flexDirection: 'column'
  },
  barBg: {
    height: '6px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: '10px'
  },
  tableCard: {
    background: '#14121a',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '2rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thRow: {
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  th: {
    padding: '0.8rem 1rem',
    fontSize: '0.72rem',
    color: '#8a849a',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 600
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)'
  },
  td: {
    padding: '1rem',
    fontSize: '0.88rem',
    color: '#ffffff'
  },
  rolePill: {
    fontSize: '0.72rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '50px',
    fontWeight: 700
  },
  platformGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.2rem',
    marginTop: '1rem'
  },
  platformCard: {
    background: '#18161f',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '1.5rem'
  }
};

export default Admin;