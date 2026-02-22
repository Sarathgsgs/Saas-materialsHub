import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUnits, renameUnit } from '../api/unitAPI';
import { getSubject } from '../api/subjectAPI';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Database } from '../types/database.types';

type Unit = Database['public']['Tables']['units']['Row'];
type Subject = Database['public']['Tables']['subjects']['Row'];

export const SubjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      // Fetch Subject Details
      const { data: subData, error: subError } = await getSubject(id);
      if (subError) throw subError;
      setSubject(subData);

      // Fetch Units
      const { data: unitData, error: unitError } = await getUnits(id);
      if (unitError) throw unitError;
      setUnits(unitData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUnitRename = async (e: React.MouseEvent, unitId: string, currentName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newName = window.prompt('Enter new unit name:', currentName);
    if (!newName || newName === currentName) return;

    try {
      const { error } = await renameUnit(unitId, newName);
      if (error) throw error;
      toast.success('Unit renamed successfully');
      fetchData();
    } catch (err: any) {
      toast.error('Failed to rename unit: ' + err.message);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );

  // If subject not found but units found (fallback for loose mock data) or generic error
  if (!subject && !loading && !error) return <div className="text-center py-12">Subject not found</div>;
  if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to={`/semester/${subject?.semester_id || 5}`} className="hover:text-primary transition-colors">Computer Science</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-primary font-semibold">{subject?.name || `Subject ${id}`}</span>
      </nav>

      {/* Subject Header Section */}
      <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary mb-3">
            CORE SUBJECT
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-3">
            {subject?.code}: {subject?.name}
          </h2>
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-200">Fall 2023 Semester</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg text-slate-900 dark:text-white font-bold transition-all">
            <span className="material-symbols-outlined text-lg">bookmark_add</span>
            Follow Subject
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-lg font-bold transition-all">
            <span className="material-symbols-outlined text-lg">upload_file</span>
            Upload
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Course Units */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">folder_open</span>
              Course Units
            </h3>
            <span className="text-sm font-medium text-slate-500">Total: {units.length} Units</span>
          </div>

          {/* Unit Cards Container */}
          <div className="space-y-4">
            {units.length === 0 ? (
              <p className="text-slate-500">No units found.</p>
            ) : (
              units.map((unit) => (
                <Link to={`/unit/${unit.id}`} key={unit.id} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary p-5 rounded-xl transition-all hover:shadow-lg flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined text-3xl">folder</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{unit.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">tag</span>
                          Unit {unit.unit_number}
                        </span>
                        <span className="size-1 rounded-full bg-slate-300"></span>
                        <span className="text-xs font-medium text-slate-500">View Files</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {role === 'admin' && (
                      <button
                        onClick={(e) => handleUnitRename(e, unit.id, unit.name)}
                        className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                        title="Rename unit"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                    )}
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Exam Prep Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">psychology</span>
              Exam Preparation
            </h3>
            {/* Mini Question Bank Card */}
            <div className="bg-white dark:bg-slate-900 border-l-4 border-yellow-500 border-y border-r border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-yellow-600 tracking-widest uppercase">Premium Resource</span>
                <span className="material-symbols-outlined text-yellow-500">hotel_class</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">Mini Question Bank</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Consolidated list of high-yield questions, previous papers, and formula cheatsheets.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-colors hover:bg-slate-100">
                  <span className="material-symbols-outlined text-slate-400 text-lg">description</span>
                  <span className="text-sm font-medium">Past Papers (2018-2022)</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-colors hover:bg-slate-100">
                  <span className="material-symbols-outlined text-slate-400 text-lg">quiz</span>
                  <span className="text-sm font-medium">Sample Quiz & Solutions</span>
                </div>
              </div>
              <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md">
                <span className="material-symbols-outlined text-lg">lock_open</span>
                Access All Resources
              </button>
            </div>
          </div>

          {/* Stats/Activity Card */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
            <h5 className="text-primary font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">insights</span>
              Student Activity
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="text-2xl font-black text-primary">1.2k</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Downloads</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="text-2xl font-black text-primary">48</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Discussions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
