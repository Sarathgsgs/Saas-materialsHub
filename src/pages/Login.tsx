import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export const Login: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') as 'student' | 'teacher' | 'admin' || 'student';

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>(initialRole);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialRole === 'admin') {
      setRole('admin');
    }
  }, [initialRole]);

  // Enforce @mhub.com suffix during typing only for registration
  useEffect(() => {
    if (isRegistering && email && !email.includes('@')) {
      // If user clears past @, we don't force it immediately to allow typing
    }
  }, [email, isRegistering]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate email suffix for registration
    if (isRegistering && !email.endsWith('@mhub.com')) {
      toast.error('Registration is restricted to @mhub.com email addresses.');
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        await signUp(email, password, { full_name: fullName, dept: department, role: role as 'student' | 'teacher' });
        setIsRegistering(false);
      } else {
        await signIn(email, password, role);
        if (role === 'admin') navigate('/admin');
        else if (role === 'teacher') navigate('/teacher');
        else navigate('/student');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-white dark:bg-slate-900 overflow-hidden font-sans">
      {/* Left Side: Illustration & Branding */}
      <div className="hidden md:flex md:w-1/2 bg-blue-50 dark:bg-slate-800 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"></rect>
          </svg>
        </div>
        <div className="relative z-10 max-w-lg text-center">
          {/* Branding */}
          <div className="flex items-center justify-center gap-3 mb-12 text-primary">
            <div className="size-10 bg-primary text-white rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-[-0.033em]">Materials Hub</h1>
          </div>
          {/* Academic Graphic */}
          <div className="mb-10 mx-auto w-full aspect-square max-w-sm rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl p-8 flex items-center justify-center">
            <span className="material-symbols-outlined text-[150px] text-primary/80">school</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight mb-4">
            {isRegistering ? 'Join the community.' : 'Empowering your academic journey.'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {isRegistering
              ? 'Create an account to access, upload, and organize your study materials efficiently.'
              : 'Access premium study resources, collaborate with peers, and manage your course materials in one secure location.'}
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-white dark:bg-slate-900 overflow-y-auto">
        <div className="w-full max-w-md my-8">
          {/* Mobile Branding */}
          <div className="flex items-center gap-3 mb-8 text-primary md:hidden justify-center">
            <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <span className="text-xl font-bold">Materials Hub</span>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {isRegistering ? 'Fill in your details to get started.' : 'Please enter your credentials to access the portal.'}
            </p>
          </div>

          {/* Card Container */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${role === 'student' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${role === 'teacher' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                Teacher
              </button>
              {!isRegistering && (
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${role === 'admin' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  Admin
                </button>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2" htmlFor="fullName">
                      <span className="material-symbols-outlined text-sm">person</span>
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2" htmlFor="department">
                      <span className="material-symbols-outlined text-sm">business</span>
                      Department
                    </label>
                    <input
                      id="department"
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Computer Science"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2" htmlFor="email">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  University Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => {
                      if (isRegistering && !email) setEmail('@mhub.com');
                    }}
                    placeholder="name@mhub.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    required
                  />
                  {isRegistering && email.endsWith('@mhub.com') && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 material-symbols-outlined text-sm">check_circle</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2" htmlFor="password">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    Password
                  </label>
                  {!isRegistering && <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>}
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              {!isRegistering && (
                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary" />
                  <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">Remember me for 30 days</label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? (isRegistering ? 'Creating Account...' : 'Signing In...') : (isRegistering ? 'Create Account' : 'Sign In')}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>

            {/* Registration Toggle */}
            <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              {isRegistering ? (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setIsRegistering(false)} className="text-primary font-bold hover:underline">Sign In</button>
                </>
              ) : (
                <>
                  Don't have an account yet?{' '}
                  <button onClick={() => setIsRegistering(true)} className="text-primary font-bold hover:underline">Create Account</button>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-800 px-3 text-slate-400 font-medium">Or</span>
              </div>
            </div>

            {/* Secondary Action */}
            <Link to="/" className="w-full py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">person</span>
              Continue as Guest
            </Link>
          </div>

          {/* Footer Links */}
          <div className="mt-12 flex justify-center gap-6 text-xs text-slate-400">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Help Center</a>
          </div>
        </div>
      </div>
    </div>
  );
};
