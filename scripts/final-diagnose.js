import axios from 'axios';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

async function finalDiagnose() {
    console.log('--- Checking PostgREST OpenAPI for column names ---');
    try {
        const res = await axios.get(`${SUPABASE_URL}/rest/v1/`, {
            headers: {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            }
        });

        const schema = res.data;

        if (schema.definitions.files) {
            console.log('\n- "files" columns:');
            const cols = Object.keys(schema.definitions.files.properties);
            cols.forEach(c => console.log('  ' + c));
        } else {
            console.log('files table NOT FOUND');
        }

        if (schema.definitions.profiles) {
            console.log('\n- "profiles" columns:');
            const cols = Object.keys(schema.definitions.profiles.properties);
            cols.forEach(c => console.log('  ' + c));
        } else {
            console.log('profiles table NOT FOUND');
        }

    } catch (err) {
        console.error('Failed to fetch schema metadata:', err.message);
    }
}

finalDiagnose();
