-- ═══════════════════════════════════════════════════
-- PORTFOLIO DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════════════

-- Profiles (portfolio owner - single row)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  roles TEXT[] DEFAULT '{}',
  location TEXT,
  availability BOOLEAN DEFAULT true,
  bio TEXT,
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  photo_url TEXT,
  cv_url TEXT,
  years_experience INT DEFAULT 0,
  projects_count INT DEFAULT 0,
  clients_count INT DEFAULT 0,
  accent_color TEXT DEFAULT '#00d4ff',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience (work experience + education/formation)
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('experience', 'formation')) NOT NULL,
  title TEXT NOT NULL,
  organization TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0
);

-- Certifications
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  issuer TEXT,
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT,
  verify_url TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('skill', 'tech')) NOT NULL,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')) NOT NULL,
  sort_order INT DEFAULT 0
);

-- ═══════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Public read projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public read experience" ON experience
  FOR SELECT USING (true);

CREATE POLICY "Public read certifications" ON certifications
  FOR SELECT USING (true);

CREATE POLICY "Public read skills" ON skills
  FOR SELECT USING (true);

-- Authenticated write access for all tables
CREATE POLICY "Auth insert profiles" ON profiles
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update profiles" ON profiles
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete profiles" ON profiles
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert projects" ON projects
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update projects" ON projects
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete projects" ON projects
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert experience" ON experience
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update experience" ON experience
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete experience" ON experience
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert certifications" ON certifications
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update certifications" ON certifications
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete certifications" ON certifications
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert skills" ON skills
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update skills" ON skills
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete skills" ON skills
  FOR DELETE TO authenticated USING (true);

-- ═══════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ═══════════════════════════════════════════════════

-- Create storage buckets (run these in Supabase Dashboard > Storage, 
-- or use the SQL below if using supabase CLI)

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read
CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Public read documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

-- Storage policies: authenticated write
CREATE POLICY "Auth upload avatars" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Auth update avatars" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'avatars');

CREATE POLICY "Auth delete avatars" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'avatars');

CREATE POLICY "Auth upload documents" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Auth update documents" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'documents');

CREATE POLICY "Auth delete documents" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'documents');
