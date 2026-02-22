import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { user, role, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-primary">Materials Hub</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link to={role === 'teacher' ? '/teacher' : role === 'admin' ? '/admin' : '/student'} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/" className="text-sm font-semibold text-primary">Courses</Link>
                <Link
                  to={role === 'teacher' ? '/teacher' : role === 'admin' ? '/admin' : '/student'}
                  className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                >
                  Library
                </Link>
                <Link to="#" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">My Uploads</Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Courses</Link>
                <Link to="#" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Faculty</Link>
                <Link to="#" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Schedule</Link>
                <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">My Library</Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={
                    role === 'admin'
                      ? '/admin'
                      : role === 'teacher'
                        ? '/teacher'
                        : '/student'
                  }
                  className="hidden sm:flex text-sm font-semibold text-primary px-4 py-2 hover:bg-primary/5 rounded-lg transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-primary/20 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="hidden sm:flex text-sm font-semibold text-primary px-4 py-2 hover:bg-primary/5 rounded-lg transition-all">Sign In</Link>
                <Link to="/login" className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-primary/20 transition-all">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
