import { createClient } from '@supabase/supabase-js';
import { coursesData } from '../src/api/coursesData.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
    console.log('Seeding semesters...');
    const uniqueSemesters = [...new Set(coursesData.map(c => c.semester))].sort((a, b) => a - b);
    const { error: semError } = await supabase
        .from('semesters')
        .upsert(uniqueSemesters.map(sem => ({
            id: sem,
            name: `Semester ${sem}`
        })));

    if (semError) console.error('Error seeding semesters:', semError.message);
    else console.log('Semesters seeded.');

    console.log('Seeding subjects...');
    const { error: subError } = await supabase
        .from('subjects')
        .upsert(coursesData.map(course => ({
            id: course.courseCode.toLowerCase(),
            semester_id: course.semester,
            name: course.courseTitle,
            code: course.courseCode,
            credits: course.credits
        })));

    if (subError) console.error('Error seeding subjects:', subError.message);
    else console.log('Subjects seeded.');
}

seed();
