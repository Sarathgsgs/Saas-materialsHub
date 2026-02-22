import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const getFiles = async (unitId: string) => {
  return await supabase
    .from('files')
    .select('*')
    .eq('unit_id', unitId)
    .order('name', { ascending: true });
};

export const getFile = async (id: string) => {
  return await supabase.from('files').select('*').eq('id', id).single();
}

export const incrementView = async (id: string) => {
  return await (supabase as any).rpc('increment_views', { file_id: id });
};

export const incrementDownload = async (id: string) => {
  return await (supabase as any).rpc('increment_downloads', { file_id: id });
};

export const uploadFile = async (
  file: File,
  metadata: {
    unit_id: string;
    subject_id: string;
    name: string;
    uploaded_by: string;
  }
) => {
  const fakeUrl = `https://mock-cloudinary.com/${uuidv4()}/${file.name}`;
  const fakePublicId = `materials-hub/${metadata.subject_id}/${metadata.unit_id}/${uuidv4()}`;

  // Real implementation would upload to Cloudinary here first
  // Then insert into Supabase

  return await supabase.from('files').insert([{
    unit_id: metadata.unit_id,
    subject_id: metadata.subject_id,
    name: metadata.name,
    original_name: file.name,
    size: file.size,
    file_type: file.type,
    download_url: fakeUrl, // In real app, this comes from Cloudinary response
    cloudinary_public_id: fakePublicId,
    uploaded_by: metadata.uploaded_by
  }] as any).select().single();
};

export const deleteFile = async (id: string) => {
  return await supabase.from('files').delete().eq('id', id);
}

export const renameFile = async (id: string, newName: string) => {
  return await (supabase as any)
    .from('files')
    .update({ name: newName })
    .eq('id', id)
    .select()
    .single();
};
