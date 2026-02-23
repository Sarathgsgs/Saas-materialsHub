import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function cleanup() {
    console.log('🧹 Cleaning up Semester 6 data...');

    // 1. Delete all files for sem 6
    console.log('Deleting files...');
    const { error: filesErr } = await supabase.from('files').delete().match({ uploaded_by: 'seed-script' });
    if (filesErr) console.error('Files delete error:', filesErr.message);

    // 2. Delete all units for subjects in sem 6
    console.log('Deleting units and subjects for Semester 6...');
    // We first fetch the subjects to delete them
    const { data: subjs } = await supabase.from('subjects').select('id').eq('semester_id', 6);
    if (subjs && subjs.length > 0) {
        const ids = subjs.map(s => s.id);

        // Delete units first (if no cascade)
        const { error: unitsErr } = await supabase.from('units').delete().in('subject_id', ids);
        if (unitsErr) console.error('Units delete error:', unitsErr.message);

        // Delete subjects
        const { error: subjErr } = await supabase.from('subjects').delete().in('id', ids);
        if (subjErr) console.error('Subjects delete error:', subjErr.message);
    }

    console.log('✅ Cleanup complete. Ready for fresh seed.');
}

cleanup().catch(console.error);
