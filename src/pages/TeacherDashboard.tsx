import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export const TeacherDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg text-white">
                <span className="material-symbols-outlined block">school</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-primary">Materials Hub</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => setActiveTab('upload')} className={`text-sm font-semibold transition-colors ${activeTab === 'upload' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}>Dashboard</button>
              <button onClick={() => setActiveTab('history')} className={`text-sm font-semibold transition-colors ${activeTab === 'history' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}>History</button>
              <a href="#" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Students</a>
              <a href="#" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Reports</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input type="text" className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary" placeholder="Search materials..." />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right hidden lg:block">
                <p className="text-xs font-bold">{user?.email || 'Teacher'}</p>
              </div>
              <div className="size-10 rounded-full border-2 border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.email?.[0].toUpperCase() || 'T'}
              </div>
              <button onClick={handleLogout} className="ml-2 p-2 text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Teacher Material Management Panel</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Create, organize, and monitor your academic resources for the current semester.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-4 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-lg">upload_file</span>
            Upload Material
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-4 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-lg">history</span>
            Upload History
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Upload Form */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'upload' && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">add_circle</span>
                  New Material Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Subject</label>
                    <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary">
                      <option>Computer Science CS101</option>
                      <option>Quantum Physics PHY202</option>
                      <option>Applied Mathematics MTH301</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Unit</label>
                    <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary">
                      <option>Unit 1: Fundamentals</option>
                      <option>Unit 2: Intermediate Concepts</option>
                      <option>Unit 3: Advanced Applications</option>
                      <option>Unit 4: Case Studies</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Material Title</label>
                  <input type="text" className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary" placeholder="e.g. Introduction to Algorithms - Lecture Slides" />
                </div>
                {/* Upload Area */}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-10 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group mb-6">
                  <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Click to upload or drag and drop</h4>
                  <p className="text-xs text-slate-500 mt-2">PDF, DOCX, PPTX, or ZIP (Max file size: 50MB)</p>
                </div>
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined">publish</span>
                  Publish Material
                </button>
              </div>
            )}

            {/* Upload History Table Section - always visible or conditional? HTML has it alongside form, but tab implies switch. HTML structure suggests left column is form AND table below it?
               Ah, HTML says "Left Column: Upload Form" and then inside that column "Upload History Table Section".
               So both are visible in Left Column?
               Or maybe I should show both if tab is upload?
               The HTML has "Upload History" tab active style: border-transparent. The "Upload Material" is active.
               Wait, the HTML structure has both form and table in the left column div.
               I'll show both for now to match structure, or respect the tab logic I added.
               I'll respect the tab logic for better UX in a real app, but looking at HTML structure again:
               The table is strictly inside the left column.
               I will show the table below the form if 'upload' tab is active, or just the table if 'history' is active.
            */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold">Recent Uploads</h3>
                <button className="text-primary text-xs font-bold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-3">File Name</th>
                      <th className="px-6 py-3">Subject & Unit</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {([] as any[]).slice(0, 3).map((file: any) => (
                      <tr key={file.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                            <span className="text-sm font-medium truncate max-w-[150px]">{file.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-bold">CS101</span>
                          <span className="text-xs text-slate-500 ml-1">Unit 2</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">{new Date(file.upload_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-red-500 border border-transparent hover:border-red-200 rounded-lg transition-all">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Stats & Info */}
          <div className="space-y-6">
            <div className="bg-primary text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-primary-100/80 text-xs font-bold uppercase tracking-widest mb-1">Total Impact</p>
                <h4 className="text-3xl font-black mb-4">1,284</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span>Material Downloads</span>
                    <span className="font-bold">842</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Active Students</span>
                    <span className="font-bold">442</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12">monitoring</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-sm mb-4">Guidelines for Upload</h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Ensure all materials comply with the university's copyright policy.</p>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Use clear naming conventions (e.g., Course_Unit_Topic).</p>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Materials should be optimized for mobile reading (PDF preferred).</p>
                </li>
              </ul>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-primary">contact_support</span>
                <h4 className="font-bold text-sm">Need Help?</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">If you experience any issues with file processing, please contact the IT Helpdesk.</p>
              <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                Contact IT Support
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 px-6 py-8 bg-white dark:bg-background-dark">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <img src="/heisenberg.png" alt="Heisenberg" className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">made by <span className="text-primary italic">Heisenberg</span></span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">© 2023 Materials Hub Academic Portal. All Rights Reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-500 hover:text-primary transition-colors">Faculty Handbook</a>
            <a href="#" className="text-xs text-slate-500 hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
