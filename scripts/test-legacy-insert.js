import axios from 'axios';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

async function testLegacyInsert() {
    console.log('Fetching a valid unit/subject...');
    const resUnit = await axios.get(`${SUPABASE_URL}/rest/v1/units?select=id,subject_id&limit=1`, {
        headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
    });

    if (resUnit.data.length === 0) {
        console.log('No units found.');
        return;
    }

    const unitId = resUnit.data[0].id;
    const subjectId = resUnit.data[0].subject_id;

    console.log('Attempting insert into "files" WITHOUT "path" column...');
    try {
        const res = await axios.post(`${SUPABASE_URL}/rest/v1/files`, {
            unit_id: unitId,
            subject_id: subjectId,
            name: 'Legacy Test',
            original_name: 'test.pdf',
            size: 1024,
            file_type: 'application/pdf',
            download_url: 'legacy/path.pdf',
            cloudinary_public_id: 'legacy',
            uploaded_by: 'legacy-script'
        }, {
            headers: {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        });
        console.log('Success! Inserted row using legacy columns.');
    } catch (err) {
        console.log('Error inserting without "path":');
        console.log(err.response?.data);
    }
}

testLegacyInsert();
