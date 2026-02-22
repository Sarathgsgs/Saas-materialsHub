import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

type Role = 'student' | 'teacher' | 'admin';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: Role | null;
  isApproved: boolean;
  loading: boolean;
  signIn: (email: string, password: string, role?: Role) => Promise<void>;
  signUp: (email: string, password: string, metadata: { full_name: string; dept: string; role: Role }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      // Mock Auth Check
      const storedUser = localStorage.getItem('mock_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        setUser(u);
        setRole(u.user_metadata?.role || 'student');
        setSession({ user: u } as Session);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase!.from('profiles').select('role, is_approved').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data) {
              setRole(data.role as Role);
              setIsApproved(data.is_approved);
            }
          });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase!.from('profiles').select('role, is_approved').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data) {
              setRole(data.role as Role);
              setIsApproved(data.is_approved);
            }
          });
      } else {
        setRole(null);
        setIsApproved(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, roleArg: Role = 'student') => {
    if (!supabase) {
      const mockUser = {
        id: 'mock-user-id',
        email,
        user_metadata: { role: roleArg, full_name: 'Mock User', dept: 'Mock Dept' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      };
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      setUser(mockUser as any);
      setRole(roleArg);
      setIsApproved(true);
      setSession({ user: mockUser } as any);
      toast.success(`Logged in as ${roleArg} (Mock)`);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Check approval
    const { data: profile } = await supabase.from('profiles').select('is_approved').eq('id', data.user.id).single();
    if (profile && !profile.is_approved && roleArg !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Your account is pending administrator approval.');
    }

    toast.success('Signed in successfully!');
  };

  const signUp = async (email: string, password: string, metadata: { full_name: string; dept: string; role: Role }) => {
    if (!supabase) {
      toast.success('Sign up simulated (Mock)');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.full_name,
          dept: metadata.dept,
          role: metadata.role
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      // Create profile entry
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: data.user.id,
        email: email,
        full_name: metadata.full_name,
        department: metadata.dept,
        role: metadata.role,
        is_approved: metadata.role === 'admin' // Admins are auto-approved for now, or bootstrapped
      }]);

      if (profileError) throw profileError;
    }

    toast.success('Registration successful! Please wait for admin approval.');
  };

  const signOut = async () => {
    if (!supabase) {
      localStorage.removeItem('mock_user');
      setUser(null);
      setRole(null);
      setSession(null);
      toast.success('Logged out (Mock)');
      return;
    }
    await supabase.auth.signOut();
    setRole(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ session, user, role, isApproved, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
