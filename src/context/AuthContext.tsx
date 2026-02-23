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

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from('profiles').select('role, is_approved').eq('id', session.user.id).single()
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
        supabase.from('profiles').select('role, is_approved').eq('id', session.user.id).single()
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

  const signIn = async (email: string, password: string, _roleArg: Role = 'student') => {

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    toast.success('Signed in successfully!');
  };

  const signUp = async (email: string, password: string, metadata: { full_name: string; dept: string; role: Role }) => {

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
