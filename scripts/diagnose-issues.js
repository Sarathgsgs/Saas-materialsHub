import axios from 'axios';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

async function diagnose() {
    console.log('--- Checking Subjects ---');
    try {
        const res = await axios.get(`${SUPABASE_URL}/rest/v1/subjects?select=id,name,code,semester_id`, {
            headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
        });
        console.log(`Total subjects: ${res.data.length}`);
        const duplicates = res.data.filter((s, i, a) => a.findIndex(t => t.code === s.code) !== i);
        if (duplicates.length > 0) {
            console.log('Duplicate subjects found (by code):', duplicates.map(d => d.code).join(', '));
        } else {
            console.log('No duplicate subjects found by code.');
        }
        console.log('Sample subjects:', res.data.slice(0, 5));
    } catch (err) {
        console.log('Error checking subjects:', err.response?.data || err.message);
    }

    console.log('\n--- Checking Profiles Columns ---');
    try {
        const res = await axios.get(`${SUPABASE_URL}/rest/v1/`, {
            headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
        });
        const profilesTable = res.data.definitions.profiles;
        if (profilesTable) {
            console.log('Profiles columns in PostgREST cache:', Object.keys(profilesTable.properties).join(', '));
            if (!profilesTable.properties.department) {
                console.log('❌ "department" column is MISSING from PostgREST cache for "profiles"');
            } else {
                console.log('✅ "department" column exists in PostgREST cache');
            }
        } else {
            console.log('Profiles table not found in schema metadata.');
        }
    } catch (err) {
        console.log('Error checking profiles schema:', err.message);
    }
}

diagnose();
