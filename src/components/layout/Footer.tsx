import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-1 rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">menu_book</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Materials Hub</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-primary transition-colors">Contact Support</Link>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <Link to="/login?role=admin" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/heisenberg.png" alt="Heisenberg" className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Made by <span className="text-primary italic">Heisenberg</span></span>
            </Link>
            <div className="text-sm text-slate-400">
              © 2025 University Materials Hub. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
