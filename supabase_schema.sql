-- Semesters Table
CREATE TABLE IF NOT EXISTS semesters (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  semester_id BIGINT REFERENCES semesters(id),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  credits DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Units Table
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id TEXT REFERENCES subjects(id),
  name TEXT NOT NULL,
  unit_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files Table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id),
  subject_id TEXT REFERENCES subjects(id),
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  path TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  download_url TEXT,
  cloudinary_public_id TEXT
);

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  department TEXT,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  file_id UUID REFERENCES files(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Downloads Log Table
CREATE TABLE IF NOT EXISTS downloads_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  file_id UUID REFERENCES files(id),
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads_log ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies
CREATE POLICY "Allow public read access for semesters" ON semesters FOR SELECT USING (true);
CREATE POLICY "Allow public read access for subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Allow public read access for units" ON units FOR SELECT USING (true);
CREATE POLICY "Allow public read access for files" ON files FOR SELECT USING (true);

-- Admin/Authenticated Write Access (Simplistic for now)
CREATE POLICY "Allow all for service role on semesters" ON semesters FOR ALL USING (true);
CREATE POLICY "Allow all for service role on subjects" ON subjects FOR ALL USING (true);
CREATE POLICY "Allow all for service role on units" ON units FOR ALL USING (true);
CREATE POLICY "Allow all for service role on files" ON files FOR ALL USING (true);
