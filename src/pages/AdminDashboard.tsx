import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminStats, getTeachers, approveUser, deleteUser, getPendingMaterials, getPendingUsers } from '../api/adminAPI';
import { toast } from 'react-hot-toast';
import { MaterialUploadForm } from '../components/MaterialUploadForm';

export const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, teachers: 0, materials: 0, pending: 0 });
  const [teachers, setTeachers] = useState<any[]>([]);
  const [pendingMaterials, setPendingMaterials] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, teachersRes, materialsRes, pendingUsersRes] = await Promise.all([
        getAdminStats(),
        getTeachers(),
        getPendingMaterials(),
        getPendingUsers()
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (teachersRes.data) setTeachers(teachersRes.data);
      if (materialsRes.data) setPendingMaterials(materialsRes.data);
      if (pendingUsersRes.data) setPendingUsers(pendingUsersRes.data);
    } catch (error: any) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleApprove = async (id: string) => {
    const { error } = await approveUser(id);
    if (error) toast.error(error.message);
    else {
      toast.success('User approved');
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const { error } = await deleteUser(id);
    if (error) toast.error(error.message);
    else {
      toast.success('User deleted');
      fetchData();
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100">
      {/* Persistent Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="bg-white/20 p-2 rounded-lg">
            <span className="material-symbols-outlined text-white">auto_stories</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Materials Hub</h1>
            <p className="text-xs text-primary-200 opacity-70">Admin Portal</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold px-3 mb-2 mt-4">Main Menu</div>
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 bg-white/10 rounded-lg text-white font-medium transition-colors">
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold px-3 mb-2 mt-6">Public View</div>
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg text-white/80 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">home</span>
            <span>View Materials Hub</span>
          </Link>
          <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold px-3 mb-2 mt-6">Academic Structure</div>
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg text-white/80 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">calendar_today</span>
            <span>Semesters</span>
          </Link>
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg text-white/80 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">book_5</span>
            <span>Subjects</span>
          </Link>
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg text-white/80 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">layers</span>
            <span>Units</span>
          </Link>
          <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold px-3 mb-2 mt-6">User Management</div>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg text-white/80 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">school</span>
            <span>Teachers</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg text-white/80 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">group</span>
            <span>Students</span>
          </Link>
          <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold px-3 mb-2 mt-6">Content Control</div>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg text-white/80 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">description</span>
            <span>Materials</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg text-white/80 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">fact_check</span>
            <span>Reviews</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link to="#" className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-white/80 transition-colors">
            <span className="material-symbols-outlined text-xl">settings</span>
            <span>Settings</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-red-300 transition-colors">
            <span className="material-symbols-outlined text-xl">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
              <input type="text" className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search across materials, teachers, or units..." />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.email || 'Admin User'}</p>
                <p className="text-[11px] text-slate-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold">
                {user?.email?.[0].toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
              <p className="text-slate-500">Welcome back. Here's what's happening across the Materials Hub today.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-lg">download</span>
                Export Data
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Add New Material
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+12%</span>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Students</p>
                <h3 className="text-2xl font-bold mt-1 uppercase">{stats.students}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+3%</span>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Active Teachers</p>
                <h3 className="text-2xl font-bold mt-1 uppercase">{stats.teachers}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                  <span className="material-symbols-outlined">upload_file</span>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">-5%</span>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Uploaded Materials</p>
                <h3 className="text-2xl font-bold mt-1 uppercase">{stats.materials}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg">
                  <span className="material-symbols-outlined">pending_actions</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+18%</span>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Pending Approvals</p>
                <h3 className="text-2xl font-bold mt-1 uppercase">{stats.pending}</h3>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="font-bold text-lg">Material Upload Trends</h4>
                <p className="text-sm text-slate-500">Activity comparison over the last 6 months</p>
              </div>
              <select className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary/20">
                <option>Monthly View</option>
                <option>Weekly View</option>
              </select>
            </div>
            <div className="relative h-[240px] w-full flex items-end gap-3 px-2">
              {/* Simplified Bar Chart Representation */}
              {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'].map((month, i) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative flex items-end overflow-hidden" style={{ height: `${45 + (i * 5)}%` }}>
                    <div className="w-full bg-primary/20 group-hover:bg-primary/40 transition-all" style={{ height: `${60 + (i * 2)}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content, User Approvals & Teacher Management */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Pending Account Approvals Section */}
            <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-lg">Pending Account Approvals</h4>
                  {pendingUsers.length > 0 && (
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">{pendingUsers.length} Pending</span>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Registered</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {pendingUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
                              {u.full_name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span className="text-sm font-medium">{u.full_name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded ${u.role === 'teacher' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {u.role?.charAt(0).toUpperCase() + u.role?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{u.department || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(u.id)}
                            className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 p-1.5 rounded-lg transition-colors"
                            title="Approve User"
                          >
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg"
                            title="Reject & Delete"
                          >
                            <span className="material-symbols-outlined text-lg">cancel</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pendingUsers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                          <span className="material-symbols-outlined text-3xl text-slate-300 mb-2 block">verified</span>
                          No pending account approvals.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Teacher Directory Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h4 className="font-bold text-lg">Teacher Directory</h4>
                <button className="text-primary text-sm font-semibold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                              {teacher.full_name?.[0] || 'T'}
                            </div>
                            <span className="text-sm font-medium">{teacher.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{teacher.department || 'N/A'}</td>
                        <td className="px-6 py-4">
                          {teacher.is_approved ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          {!teacher.is_approved && (
                            <button
                              onClick={() => handleApprove(teacher.id)}
                              className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors"
                              title="Approve Teacher"
                            >
                              <span className="material-symbols-outlined text-lg">check_circle</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(teacher.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg"
                            title="Delete User"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {teachers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No teachers found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Material Review Queue Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h4 className="font-bold text-lg">Review Queue</h4>
                <div className="flex gap-2">
                  <span className="bg-red-100 text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">High Priority</span>
                </div>
              </div>
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar">
                {pendingMaterials.map((material) => (
                  <div key={material.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm">
                      <span className="material-symbols-outlined text-primary">
                        {material.file_type.includes('pdf') ? 'picture_as_pdf' : material.file_type.includes('image') ? 'image' : 'description'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h5 className="text-sm font-bold truncate">{material.name}</h5>
                        <span className="text-[10px] text-slate-400 shrink-0">{new Date(material.upload_date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Uploaded by: {material.profiles?.full_name || 'System'}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-md">Approve</button>
                        <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold rounded-md">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingMaterials.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">No new materials to review.</div>
                )}
              </div>
            </div>
          </div>

          {/* Academic Units Management Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">Academic Units</h4>
              <button className="text-sm font-semibold flex items-center gap-1 text-slate-600 hover:text-primary transition-colors">
                Manage All Units <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Unit Card */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-1">Semester 1</p>
                    <h5 className="font-bold text-base leading-tight">Advanced Data Structures</h5>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                    <span className="material-symbols-outlined text-sm">settings</span>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Materials Uploaded</span>
                    <span className="font-bold text-slate-900 dark:text-white">45 files</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex -space-x-2 pt-1">
                    <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">S1</div>
                    <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300 flex items-center justify-center text-[8px] font-bold text-slate-500">S2</div>
                    <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-primary/10 text-primary flex items-center justify-center text-[8px] font-bold">+12</div>
                  </div>
                </div>
              </div>
              {/* Unit Card */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-1">Semester 3</p>
                    <h5 className="font-bold text-base leading-tight">Machine Learning Basics</h5>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                    <span className="material-symbols-outlined text-sm">settings</span>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Materials Uploaded</span>
                    <span className="font-bold text-slate-900 dark:text-white">12 files</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <div className="flex -space-x-2 pt-1">
                    <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">S3</div>
                    <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-primary/10 text-primary flex items-center justify-center text-[8px] font-bold">+4</div>
                  </div>
                </div>
              </div>
              {/* Add New Unit Placeholder */}
              <button className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary/50 transition-all">
                <span className="material-symbols-outlined text-3xl mb-2">add_circle</span>
                <span className="text-sm font-bold">Create New Unit</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal Overlay */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsUploadModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <MaterialUploadForm
              onSuccess={() => {
                setIsUploadModalOpen(false);
                fetchData();
              }}
              onCancel={() => setIsUploadModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
