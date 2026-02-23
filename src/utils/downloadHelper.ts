import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface FileToDownload {
  name: string;
  path: string;
}

const getPublicUrl = (path: string): string => {
  const { data } = supabase.storage.from('materials').getPublicUrl(path);
  return data.publicUrl;
};

export const downloadFilesAsZip = async (files: FileToDownload[], zipName: string) => {
  const zip = new JSZip();

  try {
    const fetchPromises = files.map(async (file) => {
      try {
        const url = getPublicUrl(file.path);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blob = await response.blob();
        zip.file(file.name, blob);
      } catch (err) {
        console.error(`Failed to fetch ${file.name}:`, err);
        zip.file(`${file.name}.error.txt`, `Failed to download: ${file.path}\nError: ${err}`);
      }
    });

    await Promise.all(fetchPromises);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${zipName}.zip`);
  } catch (error) {
    console.error('Failed to generate zip file:', error);
    toast.error('Failed to generate zip file');
  }
};

export const downloadFile = async (path: string, fileName: string) => {
  try {
    const url = getPublicUrl(path);
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: simple link click
    const url = getPublicUrl(path);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
