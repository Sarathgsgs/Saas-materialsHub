import axios from 'axios';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

async function checkSchema() {
    console.log('Checking PostgREST schema for "files" table...');
    try {
        const res = await axios.get(`${SUPABASE_URL}/rest/v1/`, {
            headers: {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            }
        });

        const schema = res.data;
        const filesTable = schema.definitions.files;
        if (!filesTable) {
            console.error('Files table not found in schema definitions.');
            return;
        }

        console.log('Columns found in PostgREST cache for "files":');
        console.log(Object.keys(filesTable.properties).join(', '));

        if (filesTable.properties.path) {
            console.log('✅ "path" IS in the PostgREST cache.');
        } else {
            console.log('❌ "path" is MISSING from the PostgREST cache.');
        }

        const profilesTable = schema.definitions.profiles;
        console.log('\nColumns found in PostgREST cache for "profiles":');
        console.log(Object.keys(profilesTable.properties).join(', '));

    } catch (err) {
        console.error('Failed to fetch schema metadata:', err.message);
        if (err.response) {
            console.error('Response data:', err.response.data);
        }
    }
}

checkSchema();
