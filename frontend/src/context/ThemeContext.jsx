import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Save to backend if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      saveThemeToBackend(theme);
    }
  }, [theme]);

  const saveThemeToBackend = async (newTheme) => {
    try {
      await api.put('/preferences', {
        theme: newTheme,
        notifications_enabled: true,
        email_notifications: true,
        language: 'en'
      });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const loadUserPreferences = async () => {
    try {
      setLoading(true);
      const res = await api.get('/preferences');
      if (res.data.theme) {
        setTheme(res.data.theme);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Theme-aware colors for inline styles
  const colors = {
    theme, // Include theme so components can do conditional logic
    background: theme === 'dark' ? '#0F172A' : '#f8f9fa',
    backgroundSecondary: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    backgroundTertiary: theme === 'dark' ? '#334155' : '#f0f4ff',
    text: theme === 'dark' ? '#F8FAFC' : '#1a1a1a',
    textSecondary: theme === 'dark' ? '#94A3B8' : '#666',
    textMuted: theme === 'dark' ? '#64748B' : '#999',
    border: theme === 'dark' ? '#334155' : '#e0e0e0',
    borderLight: theme === 'dark' ? '#475569' : '#e2e8f0',
    card: theme === 'dark' ? '#1E293B' : '#fff',
    cardHover: theme === 'dark' ? '#334155' : '#f8f9fa',
    success: theme === 'dark' ? '#065f46' : '#e8f5e9',
    successText: theme === 'dark' ? '#34d399' : '#2e7d32',
    warning: theme === 'dark' ? '#78350f' : '#fff8e1',
    warningText: theme === 'dark' ? '#fbbf24' : '#f57f17',
    danger: theme === 'dark' ? '#7f1d1d' : '#ffebee',
    dangerText: theme === 'dark' ? '#f87171' : '#c62828',
    info: theme === 'dark' ? '#1e3a8a' : '#e3f2fd',
    infoText: theme === 'dark' ? '#60a5fa' : '#1976d2',
    primary: theme === 'dark' ? '#3b82f6' : '#2196f3',
    primaryDark: theme === 'dark' ? '#2563eb' : '#1976d2',
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    loading,
    loadUserPreferences,
    colors
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
