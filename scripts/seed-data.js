import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://zinflixritqtulboiqnb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SUBJECTS = {
    'CCV': { code: '23CSX507', title: 'Cloud Computing and Virtualization', credits: 3 },
    'CD': { code: '23CS6401', title: 'Compiler Design', credits: 3 },
    'CD Lab': { code: '23CS6L01', title: 'Compiler Design Laboratory', credits: 1.5 },
    'DL': { code: '23CSX502', title: 'Deep Learning and Neural Networks', credits: 3 },
    'DTBS': { code: '23PM6101', title: 'Digital Transformation of Business and Services', credits: 3 },
    'NLP': { code: '23CSX503', title: 'Natural Language Processing Fundamentals', credits: 3 },
    'WS': { code: '23CH6603', title: 'Water and Soil Conservation', credits: 3 },
};

const SEM_6_DIR = path.resolve(__dirname, '..', 'Sem 6');

async function seed() {
    console.log('Starting seed...');

    // 1. Ensure semester 6 exists - try insert, ignore conflict
    console.log('Step 1: Semester 6');
    const { data: existingSem } = await supabase.from('semesters').select('id').eq('id', 6).single();
    if (!existingSem) {
        const { error: semError } = await supabase.from('semesters').insert({ id: 6, name: 'Semester 6' });
        if (semError) {
            console.log('Semester insert error (may already exist):', semError.message);
        } else {
            console.log('  Created Semester 6');
        }
    } else {
        console.log('  Semester 6 already exists');
    }

    // 2. Insert subjects
    console.log('Step 2: Subjects');
    for (const [folder, info] of Object.entries(SUBJECTS)) {
        const subjId = info.code.toLowerCase();
        const { data: existingSubj } = await supabase.from('subjects').select('id').eq('id', subjId).single();
        if (!existingSubj) {
            const { error } = await supabase.from('subjects').insert({
                id: subjId,
                semester_id: 6,
                name: info.title,
                code: info.code,
                credits: info.credits
            });
            if (error) {
                console.log('  Subject ' + folder + ' error:', error.message);
            } else {
                console.log('  Created: ' + folder + ' -> ' + subjId);
            }
        } else {
            console.log('  Exists: ' + folder + ' -> ' + subjId);
        }
    }

    // 3. Process each subject folder
    console.log('Step 3: Units and Files');
    for (const [folder, info] of Object.entries(SUBJECTS)) {
        const subjectDir = path.join(SEM_6_DIR, folder);
        if (!fs.existsSync(subjectDir)) {
            console.log('  Folder not found: ' + subjectDir);
            continue;
        }

        const subjId = info.code.toLowerCase();
        console.log('\nProcessing: ' + folder + ' (' + subjId + ')');

        const entries = fs.readdirSync(subjectDir, { withFileTypes: true });
        const unitFolders = entries.filter(e => e.isDirectory && e.name.toLowerCase().startsWith('unit'));
        const looseFiles = entries.filter(e => e.isFile && e.name.endsWith('.pdf'));

        // Process unit folders
        for (const unitFolder of unitFolders) {
            const unitMatch = unitFolder.name.match(/unit\s*(\d+)/i);
            const unitNumber = unitMatch ? parseInt(unitMatch[1]) : 1;

            // Get or create unit
            let unitId;
            const { data: existingUnit } = await supabase
                .from('units')
                .select('id')
                .eq('subject_id', subjId)
                .eq('unit_number', unitNumber)
                .single();

            if (existingUnit) {
                unitId = existingUnit.id;
                console.log('  Unit ' + unitNumber + ' exists: ' + unitId);
            } else {
                const { data: newUnit, error: unitError } = await supabase
                    .from('units')
                    .insert({ subject_id: subjId, name: 'Unit ' + unitNumber, unit_number: unitNumber })
                    .select('id')
                    .single();

                if (unitError) {
                    console.log('  Unit ' + unitNumber + ' error:', unitError.message);
                    continue;
                }
                unitId = newUnit.id;
                console.log('  Created Unit ' + unitNumber + ': ' + unitId);
            }

            // Upload PDFs
            const unitDir = path.join(subjectDir, unitFolder.name);
            const pdfFiles = fs.readdirSync(unitDir).filter(f => f.endsWith('.pdf'));

            for (const pdfFile of pdfFiles) {
                // Small delay to prevent fetch failure
                await new Promise(resolve => setTimeout(resolve, 500));

                const filePath = path.join(unitDir, pdfFile);
                const fileBuffer = fs.readFileSync(filePath);
                const fileSize = fs.statSync(filePath).size;
                const storagePath = subjId + '/seed-' + unitNumber + '/' + pdfFile;

                // Upload to storage
                const { error: uploadError } = await supabase.storage
                    .from('materials')
                    .upload(storagePath, fileBuffer, { contentType: 'application/pdf', upsert: true });

                if (uploadError) {
                    console.log('    Upload error ' + pdfFile + ': ' + uploadError.message);
                    continue;
                }

                // Check if already in DB
                const { data: existingFile } = await supabase
                    .from('files')
                    .select('id')
                    .eq('path', storagePath)
                    .single();

                if (existingFile) {
                    console.log('    Already in DB: ' + pdfFile);
                    continue;
                }

                const { error: insertError } = await supabase.from('files').insert({
                    unit_id: unitId,
                    subject_id: subjId,
                    name: pdfFile.replace('.pdf', ''),
                    original_name: pdfFile,
                    size: fileSize,
                    file_type: 'application/pdf',
                    path: storagePath,
                    // download_url removed
                    // cloudinary_public_id removed
                    uploaded_by: 'seed-script',
                });

                if (insertError) {
                    console.log('    DB insert error ' + pdfFile + ': ' + insertError.message);
                    console.log('    Full error:', JSON.stringify(insertError));
                } else {
                    console.log('    OK: ' + pdfFile + ' (' + Math.round(fileSize / 1024) + ' KB)');
                }
            }
        }

        // Handle loose files (no unit subfolders)
        if (looseFiles.length > 0 && unitFolders.length === 0) {
            let unitId;
            const { data: existingUnit } = await supabase
                .from('units')
                .select('id')
                .eq('subject_id', subjId)
                .eq('unit_number', 1)
                .single();

            if (existingUnit) {
                unitId = existingUnit.id;
            } else {
                const { data: newUnit, error: unitError } = await supabase
                    .from('units')
                    .insert({ subject_id: subjId, name: 'Unit 1', unit_number: 1 })
                    .select('id')
                    .single();

                if (unitError) {
                    console.log('  Unit 1 (loose) error:', unitError.message);
                    continue;
                }
                unitId = newUnit.id;
                console.log('  Created Unit 1 for loose files: ' + unitId);
            }

            for (const looseEntry of looseFiles) {
                // Small delay to prevent fetch failure
                await new Promise(resolve => setTimeout(resolve, 500));

                const filePath = path.join(subjectDir, looseEntry.name);
                const fileBuffer = fs.readFileSync(filePath);
                const fileSize = fs.statSync(filePath).size;
                const storagePath = subjId + '/seed-1/' + looseEntry.name;

                const { error: uploadError } = await supabase.storage
                    .from('materials')
                    .upload(storagePath, fileBuffer, { contentType: 'application/pdf', upsert: true });

                if (uploadError) {
                    console.log('    Upload error ' + looseEntry.name + ': ' + uploadError.message);
                    continue;
                }

                const { data: existingFile } = await supabase
                    .from('files')
                    .select('id')
                    .eq('path', storagePath)
                    .single();

                if (existingFile) {
                    console.log('    Already in DB: ' + looseEntry.name);
                    continue;
                }

                const { error: insertError } = await supabase.from('files').insert({
                    unit_id: unitId,
                    subject_id: subjId,
                    name: looseEntry.name.replace('.pdf', ''),
                    original_name: looseEntry.name,
                    size: fileSize,
                    file_type: 'application/pdf',
                    path: storagePath,
                    // download_url removed
                    // cloudinary_public_id removed
                    uploaded_by: 'seed-script',
                });

                if (insertError) {
                    console.log('    DB insert error ' + looseEntry.name + ': ' + insertError.message);
                } else {
                    console.log('    OK: ' + looseEntry.name + ' (' + Math.round(fileSize / 1024) + ' KB)');
                }
            }
        }
    }

    console.log('\nSeed complete!');
}

seed().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
