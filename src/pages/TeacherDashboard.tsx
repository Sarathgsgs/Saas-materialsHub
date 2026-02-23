import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MaterialUploadForm } from '../components/MaterialUploadForm';

export const TeacherDashboard: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Teacher Console</h1>
            <p className="text-slate-500 font-medium">Manage and publish academic materials</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-lg">logout</span>
            Exit
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Form */}
          <div className="lg:col-span-2">
            <MaterialUploadForm onSuccess={() => {
              // Optionally refresh recent activity here
            }} />
          </div>

          {/* Sidebar Tips */}
          <div className="space-y-6">
            <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl border border-primary/20">
              <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">info</span>
                Quick Tips
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm">
                  <span className="text-primary font-bold">01</span>
                  <p className="text-slate-600 dark:text-slate-400">Use clear, descriptive titles for students to easily find materials.</p>
                </li>
                <li className="flex gap-3 text-sm">
                  <span className="text-primary font-bold">02</span>
                  <p className="text-slate-600 dark:text-slate-400">Ensure units are assigned correctly to maintain organization.</p>
                </li>
                <li className="flex gap-3 text-sm">
                  <span className="text-primary font-bold">03</span>
                  <p className="text-slate-600 dark:text-slate-400">PDF is the preferred format for cross-device compatibility.</p>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold mb-4">Your Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 py-2 text-sm text-slate-400 italic">
                  No recent uploads shown in this view.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
