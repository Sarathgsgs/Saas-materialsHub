import axios from 'axios';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

async function checkRealSchema() {
    console.log('Checking real DB schema via RPC or introspection...');

    // We can try to use PostgREST's internal metadata if available
    // Or just try a select on information_schema if allowed (usually not)

    // Let's try to select from a non-existent column to see the error message
    console.log('\nAttempting to select non-existent column to trigger detailed error...');
    try {
        await axios.get(`${SUPABASE_URL}/rest/v1/files?select=non_existent_column`, {
            headers: {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            }
        });
    } catch (err) {
        console.log('Error selecting non-existent column:');
        console.log(err.response?.data);
    }

    console.log('\nAttempting to select "path" column...');
    try {
        const res = await axios.get(`${SUPABASE_URL}/rest/v1/files?select=path`, {
            headers: {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            }
        });
        console.log('Success selecting "path"! Rows returned:', res.data.length);
    } catch (err) {
        console.log('Error selecting "path":');
        console.log(err.response?.data);
    }

    console.log('\nAttempting a POST to "profiles" with minimal data...');
    try {
        const res = await axios.post(`${SUPABASE_URL}/rest/v1/profiles`, {
            id: '00000000-0000-0000-0000-000000000000',
            email: 'test@example.com',
            full_name: 'Test'
        }, {
            headers: {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        });
        console.log('Success POSTing to profiles!');
    } catch (err) {
        console.log('Error POSTing to profiles:');
        console.log(err.response?.data);
    }
}

checkRealSchema();
