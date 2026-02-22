import { supabase } from '../lib/supabase';
import { mockSemesters } from './mockData';

export const getSemesters = async () => {
  if (!supabase) {
    return { data: mockSemesters, error: null };
  }
  return await supabase
    .from('semesters')
    .select('*')
    .order('id', { ascending: true });
};

export const createSemester = async (name: string) => {
  if (!supabase) {
    const newSemester = {
      id: mockSemesters.length + 1,
      name,
      created_at: new Date().toISOString(),
    };
    mockSemesters.push(newSemester);
    return { data: [newSemester], error: null };
  }
  return await supabase.from('semesters').insert([{ name }]).select();
};

export const deleteSemester = async (id: number) => {
  if (!supabase) {
    const index = mockSemesters.findIndex((s) => s.id === id);
    if (index > -1) mockSemesters.splice(index, 1);
    return { error: null };
  }
  return await supabase.from('semesters').delete().eq('id', id);
};
