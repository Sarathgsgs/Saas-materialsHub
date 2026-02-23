import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createTeacher() {
    const email = 'teacher@mhub.com';
    const password = 'teacher@69';

    console.log('👩‍🏫 Creating teacher account...\n');

    // Check if user already exists
    const { data: userData } = await supabase.auth.admin.listUsers();
    let user = userData.users.find(u => u.email === email);

    if (!user) {
        console.log('Creating new auth user...');
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'teacher', full_name: 'Teacher Account' }
        });

        if (authError) {
            console.error('❌ Auth Error:', authError);
            return;
        }
        user = authData.user;
        console.log('✅ Auth user created:', user.id);
    } else {
        console.log('📌 User already exists:', user.id);
    }

    // Upsert profile
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            email: email,
            full_name: 'Teacher Account',
            department: 'Computer Science', // Now exists in schema
            role: 'teacher',
            is_approved: true, // Now exists in schema
        }, { onConflict: 'id' });

    if (profileError) {
        console.error('❌ Profile Error:', profileError);
    } else {
        console.log('✅ Teacher profile created/updated!');
        console.log(`\n📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log('🟢 Status: Approved');
    }
}

createTeacher().catch(console.error);
