import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFiles, renameFile } from '../api/fileAPI';
import { getUnit } from '../api/unitAPI';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Database } from '../types/database.types';
import { downloadFilesAsZip, downloadFile } from '../utils/downloadHelper';
import { getFilePublicUrl } from '../api/fileAPI';

type FileData = Database['public']['Tables']['files']['Row'];
type UnitData = Database['public']['Tables']['units']['Row'];

const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) return { icon: 'picture_as_pdf', bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-400' };
  if (fileType.includes('presentation') || fileType.includes('powerpoint') || fileType.includes('ppt')) return { icon: 'slideshow', bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-600 dark:text-orange-400' };
  if (fileType.includes('word') || fileType.includes('doc')) return { icon: 'description', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400' };
  if (fileType.includes('sheet') || fileType.includes('excel') || fileType.includes('xls')) return { icon: 'table_chart', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400' };
  if (fileType.includes('zip') || fileType.includes('compressed')) return { icon: 'folder_zip', bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-600 dark:text-purple-400' };
  return { icon: 'insert_drive_file', bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' };
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const UnitPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();
  const [files, setFiles] = useState<FileData[]>([]);
  const [unit, setUnit] = useState<UnitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [filesRes, unitRes] = await Promise.all([
        getFiles(id),
        getUnit(id)
      ]);

      if (filesRes.error) throw filesRes.error;
      if (unitRes.error) throw unitRes.error;

      setFiles(filesRes.data || []);
      setUnit(unitRes.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [id]);

  const handleRename = async (fileId: string, currentName: string) => {
    const newName = window.prompt('Enter new filename:', currentName);
    if (!newName || newName === currentName) return;

    try {
      const { error } = await renameFile(fileId, newName);
      if (error) throw error;
      toast.success('File renamed successfully');
      fetchFiles(); // Refresh list
    } catch (err: any) {
      toast.error('Failed to rename file: ' + err.message);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );
  if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/" className="hover:text-primary flex items-center gap-1">
          <span className="material-symbols-outlined text-base">home</span>
          Home
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <button onClick={() => window.history.back()} className="hover:text-primary">Subject</button>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-slate-900 dark:text-white font-medium">
          {unit ? `Unit ${unit.unit_number}: ${unit.name}` : `Unit ${id}`}
        </span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {unit ? unit.name : 'Available Materials'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {unit ? `Unit ${unit.unit_number} resources for your studies.` : 'Manage and download your study resources for this unit.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">{files.length} Files Total</span>

          <button
            onClick={() => downloadFilesAsZip(files, `Unit_${id}_Materials`)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">folder_zip</span>
            Download All
          </button>
        </div>
      </div>

      {/* Materials List */}
      <div className="space-y-3">
        {files.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">No files uploaded for this unit yet.</p>
          </div>
        ) : (
          files.map((file) => {
            const style = getFileIcon(file.file_type);
            return (
              <div key={file.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow group">
                <div className={`h-12 w-12 rounded-lg ${style.bg} ${style.text} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-3xl">{style.icon}</span>
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{file.name}</h3>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">database</span>{formatSize(file.size)}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span>{new Date(file.upload_date).toLocaleDateString()}</span>
                    {file.name.includes('pdf') && <span className="text-green-600 dark:text-green-400 font-medium">Public</span>}
                    {file.name.includes('ppt') && <span className="text-blue-600 dark:text-blue-400 font-medium">Internal</span>}
                    {file.name.includes('doc') && <span className="text-slate-500 dark:text-slate-500 font-medium">Draft</span>}
                    {file.name.includes('xls') && <span className="text-green-600 dark:text-green-400 font-medium">Public</span>}
                    {file.name.includes('zip') && <span className="text-slate-500 dark:text-slate-500 font-medium">Archived</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {role === 'admin' && (
                    <button
                      onClick={() => handleRename(file.id, file.name)}
                      className="px-4 py-2 text-sm font-semibold border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors flex items-center gap-2"
                      title="Rename file"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Rename
                    </button>
                  )}
                  <button
                    onClick={() => window.open(getFilePublicUrl(file.path), '_blank')}
                    className="px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => downloadFile(file.path, file.name)}
                    className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Download
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination / Load More */}
      {files.length > 10 && (
        <div className="mt-8 flex justify-center">
          <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:text-primary transition-colors py-2 px-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
            View All Materials
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </button>
        </div>
      )}
    </main>
  );
};
