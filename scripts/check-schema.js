import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
    console.log('Testing access to "profiles"...');
    const result = await supabase.from('profiles').select('*').limit(1);
    console.log('Result for "profiles":', JSON.stringify(result, null, 2));

    console.log('Testing access to "semesters"...');
    const result2 = await supabase.from('semesters').select('*').limit(1);
    console.log('Result for "semesters":', JSON.stringify(result2, null, 2));
}

checkSchema();
