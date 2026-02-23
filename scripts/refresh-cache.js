import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function refresh() {
    console.log('Attempting to refresh Supabase schema cache...');

    // Running a dummy SQL that changes something and reverts it usually forces a reload
    // Or just running an RPC if available. 
    // Since we don't have direct SQL access here, we can try to "touch" the table.

    const { error } = await supabase.from('files').select('id').limit(1);
    if (error) {
        console.error('Initial check error:', error.message);
    } else {
        console.log('Files table is accessible.');
    }

    console.log('\nIf "path" column is still not found, please go to Supabase Dashboard -> SQL Editor and run:');
    console.log("NOTIFY pgrst, 'reload schema';");
}

refresh().catch(console.error);
