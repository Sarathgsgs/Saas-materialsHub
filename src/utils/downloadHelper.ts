import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';

interface FileToDownload {
  name: string;
  download_url: string;
}

export const downloadFilesAsZip = async (files: FileToDownload[], zipName: string) => {
  const zip = new JSZip();

  try {
    const fetchPromises = files.map(async (file) => {
      try {
        const response = await fetch(file.download_url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blob = await response.blob();
        zip.file(file.name, blob);
      } catch (err) {
        console.error(`Failed to fetch ${file.name}:`, err);
        // Include an error file so the user knows this file failed
        zip.file(`${file.name}.error.txt`, `Failed to download: ${file.download_url}\nError: ${err}`);
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

export const downloadFile = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: simple link click (might still open in new tab for CORS)
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
