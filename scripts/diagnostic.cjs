const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function diagnostic() {
    console.log('Checking subjects table...');
    const { data, error } = await supabase.from('subjects').select('id, code, name').limit(10);
    if (error) {
        console.error('Error fetching subjects:', error.message);
    } else {
        console.log('Subjects:', data);
    }

    console.log('Checking units table...');
    const { data: units, error: unitError } = await supabase.from('units').select('id').limit(1);
    if (unitError) {
        console.error('Error fetching units:', unitError.message);
    } else {
        console.log('Units table exists.');
    }
}

diagnostic();
