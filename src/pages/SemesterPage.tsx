import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubjects } from '../api/subjectAPI';
import { Database } from '../types/database.types';

type Subject = Database['public']['Tables']['subjects']['Row'];

export const SemesterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Check for locked semesters (1-5)
  const semesterId = parseInt(id || '0');
  const isLocked = semesterId >= 1 && semesterId <= 5;

  if (isLocked) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-500">
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full mb-8">
          <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500">lock</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">
          Semester {id} Locked
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
          The study materials for this semester are currently being updated. Please check back later or explore other available semesters.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Return to Home
        </Link>
      </main>
    );
  }

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { data, error } = await getSubjects(parseInt(id));
        if (error) throw error;
        setSubjects(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );

  if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;

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
              Semester {id} – <br /><span className="text-primary">Computer Science</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-8">
              Academic Year 2024–2025 • Centralized Access to Lectures, Notes & Resources
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => document.getElementById('subjects-grid')?.scrollIntoView({ behavior: 'smooth' })} className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-primary/20 transition-transform active:scale-95">
                Explore Materials
              </button>
              {id === '6' && (
                <button
                  onClick={() => window.open('https://zinflixritqtulboiqnb.supabase.co/storage/v1/object/public/materials/sem-6/timetable.pdf', '_blank')}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-8 py-4 rounded-xl font-bold transition-transform active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  Timetable
                </button>
              )}
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
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">subject</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Subjects</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{subjects.length || 8}</p>
            </div>
          </div>
          {/* Stat Card 2 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center gap-5 group">
            <div className="bg-primary/10 group-hover:bg-primary transition-colors p-4 rounded-lg">
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">grid_view</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Units</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">45</p>
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
          <input className="block w-full pl-14 pr-4 py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-primary transition-all shadow-lg shadow-slate-200/40 dark:shadow-none text-lg" placeholder="Search for notes, previous year papers, or specific units..." type="text" />
        </div>
      </section>

      {/* Subjects Grid */}
      <section id="subjects-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Subjects</h2>
          <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-gray-500 dark:text-gray-400">No subjects found for this semester.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject: any) => {
              const fileCount = subject.files?.[0]?.count ?? subject.file_count ?? 0;
              return (
                <Link to={`/subject/${subject.id}`} key={subject.id} className="group bg-white dark:bg-slate-800 rounded-xl border-t-4 border-primary shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full overflow-hidden">
                  <div className="p-6 flex flex-col grow">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase">{subject.code}</span>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{subject.credits} Credits</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{subject.name}</h3>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="material-symbols-outlined text-sm">folder</span>
                      <span className="text-sm font-medium">{fileCount} {fileCount === 1 ? 'File' : 'Files'}</span>
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
