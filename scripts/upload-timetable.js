import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function uploadTimetable() {
    const timetablePath = path.resolve(__dirname, '..', 'Sem 6', 'Time Table', 'TIME TABLE EVEN 2025-2026(III YEAR)-1.pdf');

    if (!fs.existsSync(timetablePath)) {
        console.error('❌ Timetable file not found at:', timetablePath);
        return;
    }

    const fileBuffer = fs.readFileSync(timetablePath);
    const storagePath = 'sem-6/timetable.pdf';

    console.log('⏳ Uploading timetable to Supabase Storage...');

    const { error: uploadError } = await supabase.storage
        .from('materials')
        .upload(storagePath, fileBuffer, {
            contentType: 'application/pdf',
            upsert: true
        });

    if (uploadError) {
        console.error('❌ Upload error:', uploadError.message);
        return;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('materials')
        .getPublicUrl(storagePath);

    console.log('✅ Timetable uploaded successfully!');
    console.log('🔗 Public URL:', publicUrl);
}

uploadTimetable().catch(console.error);
