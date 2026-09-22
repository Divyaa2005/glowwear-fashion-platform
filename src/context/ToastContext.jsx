import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const success = useCallback((msg, dur) => addToast(msg, 'success', dur), [addToast]);
  const error = useCallback((msg, dur) => addToast(msg, 'error', dur || 4500), [addToast]);
  const info = useCallback((msg, dur) => addToast(msg, 'info', dur), [addToast]);
  const warning = useCallback((msg, dur) => addToast(msg, 'warning', dur), [addToast]);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, warning }}>
      {children}
      <div style={toastStyles.container}>
        {toasts.map(toast => {
          let bg = '#1e1b28';
          let border = 'rgba(255,255,255,0.1)';
          let color = '#ffffff';
          let icon = '✨';

          if (toast.type === 'success') {
            border = 'rgba(91,181,128,0.4)';
            bg = '#13231a';
            color = '#7ad89d';
            icon = '✓';
          } else if (toast.type === 'error') {
            border = 'rgba(212,96,122,0.4)';
            bg = '#2a141b';
            color = '#f2839b';
            icon = '⚠';
          } else if (toast.type === 'warning') {
            border = 'rgba(201,168,76,0.4)';
            bg = '#251e12';
            color = '#e8cb80';
            icon = '✦';
          }

          return (
            <div
              key={toast.id}
              style={{
                ...toastStyles.toast,
                backgroundColor: bg,
                borderColor: border,
                color
              }}
              onClick={() => removeToast(toast.id)}
            >
              <span style={toastStyles.icon}>{icon}</span>
              <span style={toastStyles.message}>{toast.message}</span>
              <button style={toastStyles.close}>✕</button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

const toastStyles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '420px',
    pointerEvents: 'none'
  },
  toast: {
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 18px',
    borderRadius: '14px',
    border: '1px solid',
    fontSize: '0.88rem',
    fontWeight: 500,
    boxShadow: '0 12px 35px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    animation: 'slideIn 0.25s ease-out'
  },
  icon: {
    fontSize: '1rem',
    fontWeight: 700
  },
  message: {
    flex: 1,
    lineHeight: 1.4
  },
  close: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    opacity: 0.6,
    cursor: 'pointer',
    fontSize: '0.8rem',
    padding: '2px'
  }
};
