import { supabase } from '../lib/supabase';
import { mockUnits } from './mockData';
import { v4 as uuidv4 } from 'uuid';

export const getUnits = async (subjectId: string) => {
  if (!supabase) {
    return { data: mockUnits.filter(u => u.subject_id === subjectId), error: null };
  }
  return await supabase
    .from('units')
    .select('*')
    .eq('subject_id', subjectId)
    .order('unit_number', { ascending: true });
};

export const createUnit = async (subjectId: string, name: string, unitNumber: number) => {
  if (!supabase) {
    const newUnit = {
      id: uuidv4(),
      subject_id: subjectId,
      name,
      unit_number: unitNumber,
      created_at: new Date().toISOString(),
    };
    mockUnits.push(newUnit);
    return { data: [newUnit], error: null };
  }
  return await supabase.from('units').insert([{ subject_id: subjectId, name, unit_number: unitNumber }] as any).select();
};

export const deleteUnit = async (id: string) => {
  if (!supabase) {
    const index = mockUnits.findIndex((u) => u.id === id);
    if (index > -1) mockUnits.splice(index, 1);
    return { error: null };
  }
  return await supabase.from('units').delete().eq('id', id);
};
export const getUnit = async (id: string) => {
  if (!supabase) {
    return { data: mockUnits.find(u => u.id === id) || null, error: null };
  }
  return await supabase
    .from('units')
    .select('*')
    .eq('id', id)
    .single();
};

export const renameUnit = async (id: string, newName: string) => {
  if (!supabase) {
    const unit = mockUnits.find(u => u.id === id);
    if (unit) {
      unit.name = newName;
      return { data: unit, error: null };
    }
    return { data: null, error: new Error('Unit not found') };
  }
  return await (supabase as any)
    .from('units')
    .update({ name: newName })
    .eq('id', id)
    .select()
    .single();
};
