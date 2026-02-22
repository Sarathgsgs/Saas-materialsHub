import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';

interface FileToDownload {
  name: string;
  download_url: string;
}

export const downloadFilesAsZip = async (files: FileToDownload[], zipName: string) => {
  const zip = new JSZip();

  // For this demo/mock environment, we are using placeholder content
  // In production, we'd fetch actual blobs
  files.forEach((file) => {
    const content = `This is a placeholder content for ${file.name}.\nOriginal URL: ${file.download_url}`;
    zip.file(file.name, content);
  });

  try {
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${zipName}.zip`);
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
