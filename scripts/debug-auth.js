import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function debugAuth() {
    console.log('Testing Supabase Auth connection...');
    try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (error) {
            console.error('Auth Error:', error);
        } else {
            console.log('Auth Success! Found users:', data.users.length);
        }
    } catch (err) {
        console.error('Fatal network/client error:', err);
    }

    console.log('\nTesting DB connection...');
    try {
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        if (error) {
            console.error('DB Error:', error);
        } else {
            console.log('DB Success! Found profiles:', data.length);
        }
    } catch (err) {
        console.error('Fatal network/client error (DB):', err);
    }
}

debugAuth();
