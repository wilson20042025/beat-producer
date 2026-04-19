-- SUPABASE SQL INITIALIZATION PROTOCOL

-- 1. CATEGORIES TABLE
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BEATS TABLE
CREATE TABLE beats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    bpm INTEGER NOT NULL,
    price_basic DECIMAL(10, 2) NOT NULL DEFAULT 29.99,
    price_premium DECIMAL(10, 2) NOT NULL DEFAULT 79.99,
    price_exclusive DECIMAL(10, 2) NOT NULL DEFAULT 499.00,
    audio_url TEXT NOT NULL, -- Cloudinary URL
    art_url TEXT,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS TABLE
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL, -- Cloudinary URL
    category TEXT, -- Mixing, Mastering, Production
    date DATE,
    tags TEXT[] DEFAULT '{}',
    spotify_url TEXT,
    apple_music_url TEXT,
    youtube_url TEXT,
    audiomack_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INITIAL CATEGORY SEED DATA
INSERT INTO categories (name, slug) VALUES 
('Phonk', 'phonk'),
('Jersey Club', 'jersey-club');

-- 5. INITIAL PROJECT SEED DATA
INSERT INTO projects (title, description, image_url, category, date, tags) VALUES 
('VANTABLACK', 'Professional trap production for underground charts.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUp7kDdB6Le2B-cgqUeGpveh9QnEUJmlOHLYhf9nKrjBsy8abRYOdqSSWdCFUM4Le26PAF4tOJl75cRWswD2lO9lWmEovGCdkb2xJr1irR20LgSoDaOHbQ_QAi1l0tuFNuvKfNp0DyHtR1ejPj9Z82VavaWbDci8rG7talukO88hW6nCZ0vOBkITxGfX5N6YzZLVgJ-dw8Upvftz0xs4eXBD62ikEbiQYK_CDy-UvQ1NyJ28vpWnXScjoAIWQbVkVdxbLlTxun1FM', 'PRODUCED', '2023-10-12', '{Trap, Dark}'),
('MIDNIGHT_SIN', 'Atmospheric R&B mixing and vocal processing.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA85zCXgMaWP4K9bPVJISMSXIir24PKsizNOkWP4nRQkXx2k_tntuTjrYqdmf0ke3tehm4E_Q3Mg4WclMPglIcLN1TskzclGEXmsGaS_z-7uoifNRcYdg5xeF3fUzw49gDx39-n6J3CicsbLHqDci292gHBIZ7aazkYHJYpKyDhqiNNqgX4Ai2fhC-xewTDZDvH0kDnr311aXWPLEJXE4L9NjbcozNXmIjPXahOEowRb1fypHVgtnQPl6EzDenFifjJ2sEVUbp-LQw', 'MIXED', '2024-02-15', '{R&B, Soul}'),
('CITY_LIGHTS', 'Modern drill mastering for heavy bass response.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbgDRhkiAI4UQhh5zfoDbL5dE_R5ToCFhzPKMIBdYAAa6dplad2AfwCQgX9rS2wzqAkPf-7xQ7nN1cYq7E0jS1DTz43QZeGcDKYVrUFNBl9UrUz2eZ0ep7mUg_8Au30o5bu6OQmmypio1Gc06HpvJ2_jDsOQx-ohC4NxbTEuCmTrSM6n6D7YyRINwd8JW3T4aIs13OOtNr45nf6LjxUZeqVrsKSZVhsdUkhMV9dIuul1eeI_2m35VHuXNJH4ZXjt_EGbgzGdcmnEQ', 'MASTERING', '2024-03-01', '{Drill}');

-- 6. SECURITY: ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE beats ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 7. POLICIES: PUBLIC ACCESS (READ-ONLY)
-- Allow anyone to view categories
CREATE POLICY "Allow public read" ON categories FOR SELECT USING (true);

-- Allow anyone to view beats
CREATE POLICY "Allow public read" ON beats FOR SELECT USING (true);

-- Allow anyone to view projects
CREATE POLICY "Allow public read" ON projects FOR SELECT USING (true);

-- 7. POLICIES: ADMIN ACCESS (INTERNAL PROTOCOL)
-- NOTE: For production, these should be restricted to authenticated admin users.
-- For initial setup, we allow the service_role or API to manage data.
CREATE POLICY "Allow all for authenticated users" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON beats FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON projects FOR ALL TO authenticated USING (true);
