import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logoutUser } from '../auth/auth';
import ThemeToggle from './ThemeToggle';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:opacity-70 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-text-primary">
          Welcome, {user?.name || 'User'}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <div className="text-right">
          <div className="text-sm font-medium text-text-primary">{user?.name}</div>
          <div className="text-xs text-text-muted">{user?.email}</div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
