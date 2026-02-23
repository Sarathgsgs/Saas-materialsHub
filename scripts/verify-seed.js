import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verify() {
    console.log('--- DB Verification ---');
    const { count, error } = await supabase.from('files').select('*', { count: 'exact', head: true });
    if (error) {
        console.error('Count error:', error.message);
    } else {
        console.log(`Total files in DB: ${count}`);
    }

    const { data: sems } = await supabase.from('semesters').select('id, name');
    console.log('Semesters:', sems);

    const { data: subjs } = await supabase.from('subjects').select('id');
    console.log(`Total subjects: ${subjs?.length || 0}`);

    console.log('\n--- Storage Verification ---');
    const { data: storage, error: storageError } = await supabase.storage.from('materials').list();
    if (storageError) {
        console.error('Storage error:', storageError.message);
    } else {
        console.log(`Root folders in storage: ${storage.map(f => f.name).join(', ')}`);
    }
}

verify().catch(console.error);
