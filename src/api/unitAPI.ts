import { supabase } from '../lib/supabase';

export const getUnits = async (subjectId: string) => {
  return await supabase
    .from('units')
    .select('*')
    .eq('subject_id', subjectId)
    .order('unit_number', { ascending: true });
};

export const createUnit = async (subjectId: string, name: string, unitNumber: number) => {
  return await supabase.from('units').insert([{ subject_id: subjectId, name, unit_number: unitNumber }] as any).select();
};

export const deleteUnit = async (id: string) => {
  return await supabase.from('units').delete().eq('id', id);
};
export const getUnit = async (id: string) => {
  return await supabase
    .from('units')
    .select('*')
    .eq('id', id)
    .single();
};

export const renameUnit = async (id: string, newName: string) => {
  return await (supabase as any)
    .from('units')
    .update({ name: newName })
    .eq('id', id)
    .select()
    .single();
};
