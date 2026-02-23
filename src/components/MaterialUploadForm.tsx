import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface Semester {
    id: number;
    name: string;
}

interface Subject {
    id: string;
    name: string;
    code: string;
    semester_id: number;
}

interface Unit {
    id: string;
    name: string;
    unit_number: number;
    subject_id: string;
}

interface MaterialUploadFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const MaterialUploadForm: React.FC<MaterialUploadFormProps> = ({ onSuccess, onCancel }) => {
    const { user } = useAuth();

    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);

    const [selectedSemester, setSelectedSemester] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<string>('');
    const [isCreatingUnit, setIsCreatingUnit] = useState(false);
    const [newUnitName, setNewUnitName] = useState('');
    const [newUnitNumber, setNewUnitNumber] = useState('');

    const [title, setTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [semRes, subjRes] = await Promise.all([
                supabase.from('semesters').select('*').order('id'),
                supabase.from('subjects').select('*').order('name')
            ]);
            if (semRes.data) setSemesters(semRes.data);
            if (subjRes.data) setSubjects(subjRes.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!selectedSubject) {
            setUnits([]);
            return;
        }
        const fetchUnits = async () => {
            const { data } = await supabase
                .from('units')
                .select('*')
                .eq('subject_id', selectedSubject)
                .order('unit_number');
            if (data) setUnits(data);
        };
        fetchUnits();
    }, [selectedSubject]);

    const filteredSubjects = subjects.filter(
        s => !selectedSemester || s.semester_id === parseInt(selectedSemester)
    );

    const handleUpload = async () => {
        if (!selectedSubject || (!selectedUnit && !isCreatingUnit) || !selectedFile) {
            toast.error('Missing required fields');
            return;
        }

        setLoading(true);
        try {
            let unitId = selectedUnit;

            if (isCreatingUnit) {
                if (!newUnitName || !newUnitNumber) {
                    toast.error('Unit name and number required');
                    setLoading(false);
                    return;
                }
                const { data, error } = await supabase
                    .from('units')
                    .insert([{
                        subject_id: selectedSubject,
                        name: newUnitName,
                        unit_number: parseInt(newUnitNumber)
                    }])
                    .select()
                    .single();

                if (error) throw error;
                unitId = data.id;
            }

            const subject = subjects.find(s => s.id === selectedSubject);
            const uniqueFolder = uuidv4();
            const filePath = `${subject?.code}/${uniqueFolder}/${selectedFile.name}`;

            const { error: uploadError } = await supabase.storage
                .from('materials')
                .upload(filePath, selectedFile);

            if (uploadError) throw uploadError;

            const { error: dbError } = await supabase.from('files').insert({
                name: title || selectedFile.name.replace('.pdf', ''),
                original_name: selectedFile.name,
                subject_id: selectedSubject,
                unit_id: unitId,
                size: selectedFile.size,
                file_type: selectedFile.type,
                path: filePath,
                uploaded_by: user?.id || 'System'
            } as any);

            if (dbError) throw dbError;

            toast.success('Material published successfully!');
            if (onSuccess) onSuccess();

            // Reset form
            setTitle('');
            setSelectedFile(null);
            setIsCreatingUnit(false);
            setNewUnitName('');
            setNewUnitNumber('');
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">upload_file</span>
                    Publish New Material
                </h2>
                {onCancel && (
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </div>

            <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider text-[10px]">Semester</label>
                        <select
                            value={selectedSemester}
                            onChange={(e) => { setSelectedSemester(e.target.value); setSelectedSubject(''); }}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary transition-all outline-none"
                        >
                            <option value="">All Semesters</option>
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider text-[10px]">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary transition-all outline-none"
                        >
                            <option value="">-- Choose Subject --</option>
                            {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider text-[10px]">Unit</label>
                        <button
                            onClick={() => setIsCreatingUnit(!isCreatingUnit)}
                            className="text-primary text-[10px] font-bold hover:underline flex items-center gap-1"
                        >
                            {isCreatingUnit ? 'Select Existing Unit' : '+ Create New Unit'}
                        </button>
                    </div>

                    {!isCreatingUnit ? (
                        <select
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                            disabled={!selectedSubject}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary transition-all outline-none disabled:opacity-50"
                        >
                            <option value="">-- Select Unit --</option>
                            {units.map(u => <option key={u.id} value={u.id}>Unit {u.unit_number}: {u.name}</option>)}
                        </select>
                    ) : (
                        <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                            <input
                                type="number"
                                placeholder="No."
                                value={newUnitNumber}
                                onChange={(e) => setNewUnitNumber(e.target.value)}
                                className="col-span-1 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Unit Name"
                                value={newUnitName}
                                onChange={(e) => setNewUnitName(e.target.value)}
                                className="col-span-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider text-[10px]">Display Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 2024 Final Year Question Bank"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider text-[10px]">Select PDF</label>
                        <div className="relative group cursor-pointer">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                                <span className="material-symbols-outlined text-3xl text-slate-400 mb-2 group-hover:text-primary transition-transform">cloud_upload</span>
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full">
                                    {selectedFile ? selectedFile.name : 'Click to Upload PDF'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <>
                            <div className="h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
                            Publishing...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">send</span>
                            Publish Material
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
