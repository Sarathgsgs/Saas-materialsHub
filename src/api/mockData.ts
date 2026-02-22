import { Database } from '../types/database.types';
import { coursesData } from './coursesData';

// Generate Semesters from coursesData
const uniqueSemesters = Array.from(new Set(coursesData.map(c => c.semester))).sort((a, b) => a - b);

export const mockSemesters: Database['public']['Tables']['semesters']['Row'][] = uniqueSemesters.map(sem => ({
  id: sem,
  name: `Semester ${sem}`,
  created_at: new Date().toISOString(),
}));

// Generate Subjects from coursesData
export const mockSubjects: Database['public']['Tables']['subjects']['Row'][] = coursesData.map(course => ({
  id: course.courseCode.toLowerCase(),
  semester_id: course.semester,
  name: course.courseTitle,
  code: course.courseCode,
  credits: course.credits,
  created_at: new Date().toISOString(),
}));

// Generate Dummy Units for each Subject (since coursesData doesn't have units)
export const mockUnits: Database['public']['Tables']['units']['Row'][] = [];
mockSubjects.forEach(subject => {
  for (let i = 1; i <= 5; i++) {
    mockUnits.push({
      id: `u${i}-${subject.id}`,
      subject_id: subject.id,
      name: `Unit ${i}: ${subject.name} Fundamentals`, // Dummy name
      unit_number: i,
      created_at: new Date().toISOString(),
    });
  }
});

// Generate Mock Files
// We'll attach some files to the first unit of the first few subjects to ensure there's data to see
export const mockFiles: Database['public']['Tables']['files']['Row'][] = [];

// Helper to add files to a specific unit
const addFilesToUnit = (unitId: string, subjectId: string, subjectCode: string) => {
  mockFiles.push(
    {
      id: `f1-${unitId}`,
      unit_id: unitId,
      subject_id: subjectId,
      name: `${subjectCode}_Lecture_Notes_Unit1.pdf`,
      original_name: `${subjectCode}_Lecture_Notes_Unit1.pdf`,
      size: 2.4 * 1024 * 1024,
      file_type: 'application/pdf',
      download_url: '#',
      cloudinary_public_id: `pdf-${unitId}`,
      uploaded_by: 'teacher1',
      upload_date: '2023-10-12',
      views: 120,
      downloads: 45,
    },
    {
      id: `f2-${unitId}`,
      unit_id: unitId,
      subject_id: subjectId,
      name: `${subjectCode}_Slides_Intro.pptx`,
      original_name: `${subjectCode}_Slides_Intro.pptx`,
      size: 15.1 * 1024 * 1024,
      file_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      download_url: '#',
      cloudinary_public_id: `ppt-${unitId}`,
      uploaded_by: 'teacher1',
      upload_date: '2023-10-14',
      views: 85,
      downloads: 20,
    }
  );
};

// Add files to the first unit of every subject
mockUnits.filter(u => u.unit_number === 1).forEach(unit => {
  // Find the subject code
  const subject = mockSubjects.find(s => s.id === unit.subject_id);
  if (subject) {
    addFilesToUnit(unit.id, subject.id, subject.code);
  }
});

export const mockBookmarks: Database['public']['Tables']['bookmarks']['Row'][] = [];
export const mockDownloads: Database['public']['Tables']['downloads_log']['Row'][] = [];
