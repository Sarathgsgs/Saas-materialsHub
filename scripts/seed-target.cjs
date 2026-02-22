const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const sem6Subjects = [
    { id: '23csx507', name: 'Cloud Computing and Virtualization', code: '23CSX507', semester_id: 6, credits: 3 },
    { id: '23cs6401', name: 'Compiler Design', code: '23CS6401', semester_id: 6, credits: 3 },
    { id: '23csx502', name: 'Deep Learning and Neural Networks', code: '23CSX502', semester_id: 6, credits: 3 },
    { id: '23pm6101', name: 'Digital Transformation of Business and Services', code: '23PM6101', semester_id: 6, credits: 3 },
    { id: '23csx503', name: 'Natural Language Processing Fundamentals', code: '23CSX503', semester_id: 6, credits: 3 },
    { id: '23ch6603', name: 'Water and Soil Conservation', code: '23CH6603', semester_id: 6, credits: 3 }
];

async function targetedSeed() {
    console.log('Ensuring Semester 6 exists...');
    await supabase.from('semesters').upsert([{ id: 6, name: 'Semester 6' }]);

    console.log('Seeding Sem 6 subjects...');
    for (const subject of sem6Subjects) {
        console.log(`Upserting ${subject.id}...`);
        const { error } = await supabase.from('subjects').upsert([subject]);
        if (error) console.error(`Error for ${subject.id}:`, error.message);
    }
}

targetedSeed().then(() => console.log('Targeted seeding done!'));
