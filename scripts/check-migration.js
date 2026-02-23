import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
    console.log('Running migration: adding path column to files table...\n');

    // We can't run raw SQL via the client library directly.
    // Instead, we'll use the Supabase Management API (REST) to run SQL.
    // However, the simplest approach is to use the RPC or check if the column exists
    // by attempting an insert and validating.

    // Let's try an approach: insert a test row and see if path is accepted
    // If not, the user needs to run SQL manually in the Supabase dashboard.

    // First, let's check the current schema by trying to select the path column
    const { data, error } = await supabase
        .from('files')
        .select('path')
        .limit(1);

    if (error) {
        if (error.message.includes('path') || error.code === 'PGRST204') {
            console.log('❌ The "path" column does NOT exist in the files table.');
            console.log('\nPlease run the following SQL in Supabase Dashboard → SQL Editor:\n');
            console.log('---');
            console.log(`ALTER TABLE files ADD COLUMN IF NOT EXISTS path TEXT;`);
            console.log(`ALTER TABLE files ALTER COLUMN download_url DROP NOT NULL;`);
            console.log(`ALTER TABLE files ALTER COLUMN cloudinary_public_id DROP NOT NULL;`);
            console.log(`UPDATE files SET path = download_url WHERE path IS NULL;`);
            console.log('---');
            console.log('\nAfter running the SQL, re-run the seed script.');
        } else {
            console.error('Unexpected error:', error);
        }
    } else {
        console.log('✅ The "path" column already exists in the files table.');
        console.log('Data returned:', data);
        console.log('\nYou can proceed with running the seed script.');
    }
}

migrate().catch(console.error);
