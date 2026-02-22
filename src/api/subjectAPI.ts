import { supabase } from '../lib/supabase';

export const getSubjects = async (semesterId: number) => {
  return await supabase
    .from('subjects')
    .select('*, files(count)')
    .eq('semester_id', semesterId)
    .order('name', { ascending: true });
};

export const getSubject = async (id: string) => {
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

  return await supabase
    .from('subjects')
    .insert([newSubject] as any)
    .select();
};

export const deleteSubject = async (id: string) => {
  return await supabase.from('subjects').delete().eq('id', id);
};
