import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function addAdmin() {
    const email = 'admin69@mhub.com';
    const password = 'Walterwhite';

    const { data: userData } = await supabase.auth.admin.listUsers();
    let user = userData.users.find(u => u.email === email);

    if (!user) {
        console.log('Creating new user...');
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'admin' }
        });
        if (authError) {
            console.error('Auth Error:', authError);
            return;
        }
        user = authData.user;
    }

    console.log('User ID:', user.id);

    // Try to insert profile with ONLY baseline columns
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            email: email,
            full_name: 'Walter White',
            role: 'admin'
            // department and is_approved omitted for testing
        });

    if (profileError) {
        console.error('Profile Error (Baseline):', profileError);
    } else {
        console.log('✅ Baseline Admin profile created!');
        console.log('Important: is_approved and department were NOT set because the columns might be missing.');
    }
}

addAdmin();
