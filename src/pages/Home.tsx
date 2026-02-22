import React, { useEffect, useState } from 'react';
import { getSemesters } from '../api/semesterAPI';
import { Link } from 'react-router-dom';
import { Database } from '../types/database.types';
import { toast } from 'react-hot-toast';

type Semester = Database['public']['Tables']['semesters']['Row'];

export const Home: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const { data, error } = await getSemesters();
        if (error) throw error;
        setSemesters(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSemesters();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-24 w-64 h-64 bg-primary/40 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-primary/10 text-primary mb-6">
              University Portal
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter mb-4">
              Materials Hub <br /><span className="text-primary">Centralized Access</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-8">
              Academic Year 2024–2025 • Lectures, Notes & Resources for All Semesters
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => document.getElementById('semesters-grid')?.scrollIntoView({ behavior: 'smooth' })} className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-primary/20 transition-transform active:scale-95">
                Explore Semesters
              </button>
              <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-8 py-4 rounded-xl font-bold transition-transform active:scale-95 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">download</span>
                App Guide
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center gap-5 group">
            <div className="bg-primary/10 group-hover:bg-primary transition-colors p-4 rounded-lg">
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">school</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Semesters</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{semesters.length || 8}</p>
            </div>
          </div>
          {/* Stat Card 2 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center gap-5 group">
            <div className="bg-primary/10 group-hover:bg-primary transition-colors p-4 rounded-lg">
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">grid_view</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Units</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">45+</p>
            </div>
          </div>
          {/* Stat Card 3 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center gap-5 group">
            <div className="bg-primary/10 group-hover:bg-primary transition-colors p-4 rounded-lg">
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">description</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Digital Files</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">1,200+</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-12">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          </div>
          <input type="text" className="block w-full pl-14 pr-4 py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-primary transition-all shadow-lg shadow-slate-200/40 dark:shadow-none text-lg" placeholder="Search for notes, previous year papers, or specific units..." />
        </div>
      </section>

      {/* Semesters Grid */}
      <section id="semesters-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Browse Semesters</h2>
          <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        
        {loading ? (
             <div className="flex justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
             </div>
        ) : error ? (
            <div className="text-center py-20 text-red-500">
                {error}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {semesters.map((semester) => {
                const isLocked = semester.id >= 1 && semester.id <= 5;
                
                if (isLocked) {
                    return (
                        <div 
                            key={semester.id} 
                            onClick={() => {
                                toast.error("Not available now, will be updated later");
                            }}
                            className="group bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-80 cursor-not-allowed flex flex-col h-full overflow-hidden relative"
                        >
                            <div className="p-6 flex flex-col grow relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                <span className="px-2.5 py-1 bg-slate-200 text-slate-500 text-xs font-bold rounded uppercase">SEM {semester.id}</span>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">lock</span> Locked
                                </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-500 dark:text-slate-500 mb-2">{semester.name}</h3>
                                <div className="flex items-center gap-3 mt-auto pt-6">
                                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-300">lock</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-medium">Status</span>
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Not Available</span>
                                </div>
                                </div>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-950/50 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center opacity-50">
                                <div className="flex items-center gap-1 text-slate-400">
                                <span className="material-symbols-outlined text-sm">folder_off</span>
                                <span className="text-sm font-medium">Locked</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-400">lock</span>
                            </div>
                        </div>
                    );
                }

                return (
                    <Link to={`/semester/${semester.id}`} key={semester.id} className="group bg-white dark:bg-slate-800 rounded-xl border-t-4 border-primary shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full overflow-hidden">
                    <div className="p-6 flex flex-col grow">
                        <div className="flex justify-between items-start mb-4">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase">SEM {semester.id}</span>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Active</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{semester.name}</h3>
                        <div className="flex items-center gap-3 mt-auto pt-6">
                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-400">school</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-medium">Status</span>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Open for Access</span>
                        </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <div className="flex items-center gap-1 text-slate-500">
                        <span className="material-symbols-outlined text-sm">folder</span>
                        <span className="text-sm font-medium">Browse Subjects</span>
                        </div>
                        <button className="text-primary hover:text-primary/80">
                        <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                    </Link>
                );
            })}
            </div>
        )}
      </section>
    </main>
  );
};
