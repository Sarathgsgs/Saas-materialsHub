const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Extract data from coursesData.ts
const coursesDataPath = path.join(__dirname, '..', 'src', 'api', 'coursesData.ts');
const coursesDataContent = fs.readFileSync(coursesDataPath, 'utf8');

// A crude but effective regex to extract the array from the TS file
const arrayMatch = coursesDataContent.match(/export const coursesData = (\[[\s\S]*?\]);/);
if (!arrayMatch) {
    console.error('Could not extract coursesData from TS file.');
    process.exit(1);
}

let coursesData;
try {
    // Use eval-like parsing for the array string
    coursesData = JSON.parse(arrayMatch[1].replace(/'/g, '"').replace(/(\w+):/g, '"$1":').replace(/,(\s*\])/, '$1'));
} catch (e) {
    // If JSON.parse fails due to formatting, fallback to a simpler approach or just use the string
    // For this specific file, it's already mostly JSON-like
    try {
        // A slightly more robust approach for JS-like objects
        coursesData = eval(arrayMatch[1]);
    } catch (evalError) {
        console.error('Error parsing coursesData:', evalError.message);
        process.exit(1);
    }
}

async function seed() {
    console.log('Seeding semesters...');
    const uniqueSemesters = [...new Set(coursesData.map(c => c.semester))].sort((a, b) => a - b);
    const { error: semError } = await supabase
        .from('semesters')
        .upsert(uniqueSemesters.map(sem => ({
            id: sem,
            name: `Semester ${sem}`
        })));

    if (semError) {
        console.error('Error seeding semesters:', semError.message);
        return;
    }
    console.log('Semesters seeded.');

    console.log('Seeding subjects in batches...');
    const subjects = coursesData.map(course => ({
        id: course.courseCode.toLowerCase(),
        semester_id: course.semester,
        name: course.courseTitle,
        code: course.courseCode,
        credits: course.credits
    }));

    const BATCH_SIZE = 50;
    for (let i = 0; i < subjects.length; i += BATCH_SIZE) {
        const batch = subjects.slice(i, i + BATCH_SIZE);
        console.log(`Seeding batch ${i / BATCH_SIZE + 1}...`);
        const { error: subError } = await supabase
            .from('subjects')
            .upsert(batch);

        if (subError) {
            console.error(`Error seeding subject batch ${i / BATCH_SIZE + 1}:`, subError.message);
        }
    }
    console.log('Subjects seeding completed.');
}

seed().then(() => console.log('Done!'));
