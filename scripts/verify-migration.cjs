const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verify() {
    console.log('Verifying migration...');

    const { count: fileCount, error: fileError } = await supabase
        .from('files')
        .select('*', { count: 'exact', head: true });

    const { count: unitCount, error: unitError } = await supabase
        .from('units')
        .select('*', { count: 'exact', head: true });

    const { count: subjectCount, error: subError } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true });

    if (fileError || unitError || subError) {
        console.error('Verification error:', fileError || unitError || subError);
    } else {
        console.log(`Total Files: ${fileCount}`);
        console.log(`Total Units: ${unitCount}`);
        console.log(`Total Subjects: ${subjectCount}`);
    }
}

verify();
