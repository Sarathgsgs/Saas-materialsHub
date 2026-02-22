const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BASE_DIR = path.join(__dirname, '..', 'Sem 6');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing environment variables: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Mapping folder names to Subject IDs (from coursesData.ts/mockSubjects)
const subjectMapping = {
  'CCV': '23csx507',
  'CD': '23cs6401',
  'DL': '23csx502',
  'DTBS': '23pm6101',
  'NLP': '23csx503',
  'WS': '23ch6603'
};

async function uploadFiles() {
  const subjects = fs.readdirSync(BASE_DIR);

  for (const subjectDir of subjects) {
    const subjectPath = path.join(BASE_DIR, subjectDir);
    if (!fs.statSync(subjectPath).isDirectory()) continue;

    const subjectId = subjectMapping[subjectDir];
    if (!subjectId) {
      console.warn(`No mapping found for subject directory: ${subjectDir}`);
      continue;
    }

    console.log(`Processing subject: ${subjectDir} (${subjectId})`);

    const units = fs.readdirSync(subjectPath);
    for (const unitDir of units) {
      const unitPath = path.join(subjectPath, unitDir);
      if (!fs.statSync(unitPath).isDirectory()) continue;

      // Extract unit number (e.g., "Unit 1" -> 1)
      const unitNumberMatch = unitDir.match(/Unit\s+(\d+)/i);
      if (!unitNumberMatch) continue;
      const unitNumber = parseInt(unitNumberMatch[1]);

      // Find or Create Unit in DB
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('id')
        .eq('subject_id', subjectId)
        .eq('unit_number', unitNumber)
        .single();

      let dbUnitId;
      if (unitError || !unitData) {
        console.log(`Creating unit ${unitNumber} for ${subjectId}...`);
        const { data: newUnit, error: createError } = await supabase
          .from('units')
          .insert([{
            subject_id: subjectId,
            name: `Unit ${unitNumber}`,
            unit_number: unitNumber
          }])
          .select()
          .single();

        if (createError) {
          console.error(`Error creating unit: ${createError.message}`);
          continue;
        }
        dbUnitId = newUnit.id;
      } else {
        dbUnitId = unitData.id;
      }

      // Process files in unit
      const files = fs.readdirSync(unitPath);
      for (const fileName of files) {
        if (!fileName.endsWith('.pdf')) continue;

        const filePath = path.join(unitPath, fileName);
        const fileBuffer = fs.readFileSync(filePath);
        const storagePath = `materials/${subjectId}/${dbUnitId}/${fileName}`;

        console.log(`Uploading ${fileName}...`);

        // 1. Upload to Storage
        const { error: storageError } = await supabase.storage
          .from('materials')
          .upload(storagePath, fileBuffer, {
            contentType: 'application/pdf',
            upsert: true
          });

        if (storageError) {
          console.error(`Error uploading ${fileName} to storage: ${storageError.message}`);
          continue;
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('materials')
          .getPublicUrl(storagePath);

        // 3. Insert metadata into "files" table
        const { error: insertError } = await supabase
          .from('files')
          .insert([{
            unit_id: dbUnitId,
            subject_id: subjectId,
            name: fileName.replace(/\.pdf$/i, ''),
            original_name: fileName,
            size: fs.statSync(filePath).size,
            file_type: 'application/pdf',
            download_url: publicUrl,
            cloudinary_public_id: storagePath, // Reusing field for storage path
            uploaded_by: 'admin'
          }]);

        if (insertError) {
          console.error(`Error inserting ${fileName} metadata: ${insertError.message}`);
        } else {
          console.log(`Successfully processed ${fileName}`);
        }
      }
    }
  }
}

uploadFiles().then(() => console.log('Done!'));
