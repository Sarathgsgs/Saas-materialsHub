import { supabase } from '../lib/supabase';

export const getAdminStats = async () => {
    if (!supabase) return { data: { students: 0, teachers: 0, materials: 0, pending: 0 }, error: null };

    const results = await Promise.allSettled([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),
        supabase.from('files').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_approved', false)
    ]);

    const stats = {
        students: results[0].status === 'fulfilled' && !(results[0].value as any).error ? (results[0].value as any).count || 0 : 0,
        teachers: results[1].status === 'fulfilled' && !(results[1].value as any).error ? (results[1].value as any).count || 0 : 0,
        materials: results[2].status === 'fulfilled' && !(results[2].value as any).error ? (results[2].value as any).count || 0 : 0,
        pending: results[3].status === 'fulfilled' && !(results[3].value as any).error ? (results[3].value as any).count || 0 : 0
    };

    return { data: stats, error: null };
};

export const getTeachers = async () => {
    if (!supabase) return { data: [], error: null };
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'teacher')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data: data || [], error: null };
    } catch (err: any) {
        console.error('getTeachers error:', err);
        return { data: [], error: err };
    }
};

export const approveUser = async (userId: string) => {
    if (!supabase) return { error: null };
    return await (supabase as any)
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', userId);
};

export const deleteUser = async (userId: string) => {
    if (!supabase) return { error: null };
    return await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
};

export const getPendingMaterials = async () => {
    if (!supabase) return { data: [], error: null };
    try {
        const { data, error } = await supabase
            .from('files')
            .select('*, profiles(full_name)')
            .order('upload_date', { ascending: false })
            .limit(10);

        if (error) throw error;
        return { data: data || [], error: null };
    } catch (err: any) {
        console.error('getPendingMaterials error:', err);
        return { data: [], error: err };
    }
};
