import { supabase } from '../lib/supabase';

export const getSemesters = async () => {
  return await supabase
    .from('semesters')
    .select('*')
    .order('id', { ascending: true });
};

export const createSemester = async (name: string) => {
  return await supabase.from('semesters').insert([{ name }]).select();
};

export const deleteSemester = async (id: number) => {
  return await supabase.from('semesters').delete().eq('id', id);
};
