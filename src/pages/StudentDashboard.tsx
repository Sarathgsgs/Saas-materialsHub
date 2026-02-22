import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockFiles } from '../api/mockData';

export const StudentDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100">
      {/* Side Navigation Bar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-6 flex flex-col h-full">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="bg-primary rounded-lg p-2 flex items-center justify-center text-white">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <div>
              <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none">Materials Hub</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Academic Portal</p>
            </div>
          </Link>
          <nav className="flex-1 space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm">Dashboard</span>
            </button>
            <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">library_books</span>
              <span className="text-sm">All Courses</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">cloud_upload</span>
              <span className="text-sm">My Uploads</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">bookmarks</span>
              <span className="text-sm">Saved Files</span>
            </button>
          </nav>
          <div className="mt-auto space-y-4">
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-xl">settings</span>
                <span className="text-sm">Settings</span>
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-xl">logout</span>
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Study Dashboard</h2>
          <div className="flex items-center gap-6">
            <div className="relative w-64 hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input type="text" className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder-slate-500" placeholder="Search materials..." />
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
              </button>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold leading-none text-slate-900 dark:text-white">{user?.email || 'Student'}</p>
                </div>
                <div className="size-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold">
                  {user?.email?.[0].toUpperCase() || 'S'}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stat Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Downloads</p>
                  <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">128</h3>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-lg">
                  <span className="material-symbols-outlined">download_for_offline</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>+12% this week</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Bookmarked Files</p>
                  <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">45</h3>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                  <span className="material-symbols-outlined">bookmark_star</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>+5% this week</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Recently Viewed</p>
                  <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">12</h3>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>Active today</span>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content: Recent Downloads Table */}
            <section className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Recent Downloads
                </h4>
                <button className="text-sm font-semibold text-primary hover:underline">View All</button>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">File Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {mockFiles.slice(0, 4).map((file) => (
                        <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                              <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{file.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">CS & AI</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(file.upload_date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-primary hover:text-primary/70 font-bold text-sm">Download</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Sidebar Content: Bookmarked Files */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">bookmark</span>
                  Saved for Later
                </h4>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-2">
                <div className="space-y-1">
                  <div className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 group transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-slate-500 group-hover:text-primary">
                          <span className="material-symbols-outlined">menu_book</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Discrete Structures Q&A</p>
                          <p className="text-xs text-slate-500 font-medium">Exam Prep • 12 MB</p>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-all">
                        <span className="material-symbols-outlined text-lg">open_in_new</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 group transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-slate-500 group-hover:text-primary">
                          <span className="material-symbols-outlined">description</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">World History: Industrial Era</p>
                          <p className="text-xs text-slate-500 font-medium">History • 5.4 MB</p>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-all">
                        <span className="material-symbols-outlined text-lg">open_in_new</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 px-3 pb-2">
                  <button className="w-full py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all">
                    MANAGE ALL BOOKMARKS
                  </button>
                </div>
              </div>

              {/* Course Progress/Quick Tip Section */}
              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-5 rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">lightbulb</span>
                  <div>
                    <h5 className="text-sm font-bold text-primary">Study Tip</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">You haven't checked the <strong>Computer Science 202</strong> materials this week. New lectures were uploaded yesterday!</p>
                    <button className="mt-3 text-xs font-bold text-primary underline underline-offset-4">Go to course</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
