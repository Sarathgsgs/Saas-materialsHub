import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import { mockSubjects, mockFiles } from './mockData';

export const getSubjects = async (semesterId: number) => {
  if (!supabase) {
    const subjects = mockSubjects.filter(s => s.semester_id === semesterId);
    const data = subjects.map(subject => ({
      ...subject,
      file_count: mockFiles.filter(f => f.subject_id === subject.id).length
    }));
    return { data, error: null };
  }
  return await supabase
    .from('subjects')
    .select('*, files(count)')
    .eq('semester_id', semesterId)
    .order('name', { ascending: true });
};

export const getSubject = async (id: string) => {
  if (!supabase) {
    return { data: mockSubjects.find(s => s.id === id) || null, error: null };
  }
  return await supabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .single();
};

export const createSubject = async (semesterId: number, name: string, code: string, credits: number = 3) => {
  const newSubject = {
    id: code.toLowerCase(),
    semester_id: semesterId,
    name,
    code,
    credits,
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    mockSubjects.push(newSubject as Database['public']['Tables']['subjects']['Row']);
    return { data: [newSubject], error: null };
  }

  return await supabase
    .from('subjects')
    .insert([newSubject] as any)
    .select();
};

export const deleteSubject = async (id: string) => {
  if (!supabase) {
    const index = mockSubjects.findIndex((s) => s.id === id);
    if (index > -1) mockSubjects.splice(index, 1);
    return { error: null };
  }
  return await supabase.from('subjects').delete().eq('id', id);
};
