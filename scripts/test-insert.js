import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testInsert() {
    console.log('Testing single file insert...');

    // Try to find a valid unit_id and subject_id first
    const { data: units } = await supabase.from('units').select('id, subject_id').limit(1);
    if (!units || units.length === 0) {
        console.error('No units found in DB. Seeding units must happen first.');
        return;
    }

    const unitId = units[0].id;
    const subjectId = units[0].subject_id;

    console.log(`Using unitId: ${unitId}, subjectId: ${subjectId}`);

    const { data, error } = await supabase.from('files').insert({
        unit_id: unitId,
        subject_id: subjectId,
        name: 'Test File',
        original_name: 'test.pdf',
        size: 1024,
        file_type: 'application/pdf',
        path: 'test/path.pdf',
        download_url: 'test/path.pdf',
        cloudinary_public_id: 'test',
        uploaded_by: 'test-script'
    }).select();

    if (error) {
        console.error('Insert error details:');
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        console.error('Hint:', error.hint);
        console.error('Details:', error.details);
    } else {
        console.log('Success! Inserted row:', data);
    }
}

testInsert().catch(console.error);
