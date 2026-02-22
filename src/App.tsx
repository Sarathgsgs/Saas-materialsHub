import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { SemesterPage } from './pages/SemesterPage';
import { SubjectPage } from './pages/SubjectPage';
import { UnitPage } from './pages/UnitPage';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

// Layout wrapper for public pages that includes Navbar and Footer
const PublicLayout = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/semester/:id" element={<SemesterPage />} />
              <Route path="/subject/:id" element={<SubjectPage />} />
              <Route path="/unit/:id" element={<UnitPage />} />
            </Route>
            
            <Route path="/login" element={<Login />} />

            {/* Dashboard Routes - They have their own layouts */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};
