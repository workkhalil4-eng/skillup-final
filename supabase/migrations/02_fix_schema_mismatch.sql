-- Migration: 02_fix_schema_mismatch.sql
-- Description: Adapts legacy tables (courses, enrollments), aligns column names, and sets up RLS and functions safely.

-- 1. Create User Roles Enum safely
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role public.user_role DEFAULT 'student'::public.user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Instructors Table
CREATE TABLE IF NOT EXISTS public.instructors (
    id UUID REFERENCES public.profiles(id) PRIMARY KEY,
    bio TEXT,
    expertise TEXT[],
    rating DECIMAL(3,2) DEFAULT 0.0,
    students_count INTEGER DEFAULT 0
);

-- 4. Adapt and Create Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instructor_id UUID REFERENCES public.instructors(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration TEXT,
    level TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Rename 'published' -> 'is_published' if older table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='courses' AND column_name='published') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='courses' AND column_name='is_published') THEN
    ALTER TABLE public.courses RENAME COLUMN published TO is_published;
  ELSE
    ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Add any missing columns to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'All Levels';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 5. Adapt and Create Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id),
    course_id UUID REFERENCES public.courses(id),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Adapt legacy column names in enrollments if needed
DO $$ 
BEGIN
  -- Rename user_id -> student_id if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='enrollments' AND column_name='user_id') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='enrollments' AND column_name='student_id') THEN
    ALTER TABLE public.enrollments RENAME COLUMN user_id TO student_id;
  ELSE
    ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.profiles(id);
  END IF;

  -- Rename created_at -> enrolled_at if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='enrollments' AND column_name='created_at') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='enrollments' AND column_name='enrolled_at') THEN
    ALTER TABLE public.enrollments RENAME COLUMN created_at TO enrolled_at;
  ELSE
    ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
  END IF;
END $$;

-- 6. Messages (Contact Form) Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING ( true );

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE
USING ( auth.uid() = id )
WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Instructors Policies
DROP POLICY IF EXISTS "Instructor profiles are viewable by everyone." ON public.instructors;
CREATE POLICY "Instructor profiles are viewable by everyone." ON public.instructors FOR SELECT USING ( true );

DROP POLICY IF EXISTS "Users can register as instructor." ON public.instructors;
CREATE POLICY "Users can register as instructor." ON public.instructors FOR INSERT
WITH CHECK (
    auth.uid() = id
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'instructor')
);

DROP POLICY IF EXISTS "Instructors can update own profile." ON public.instructors;
CREATE POLICY "Instructors can update own profile." ON public.instructors FOR UPDATE
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- Courses Policies
DROP POLICY IF EXISTS "Published courses are viewable by everyone." ON public.courses;
CREATE POLICY "Published courses are viewable by everyone." ON public.courses FOR SELECT
USING ( is_published = true OR auth.uid() = instructor_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') );

DROP POLICY IF EXISTS "Instructors can insert their own courses." ON public.courses;
CREATE POLICY "Instructors can insert their own courses." ON public.courses FOR INSERT
WITH CHECK ( auth.uid() = instructor_id AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'instructor') );

DROP POLICY IF EXISTS "Instructors can update their own courses." ON public.courses;
CREATE POLICY "Instructors can update their own courses." ON public.courses FOR UPDATE
USING ( auth.uid() = instructor_id )
WITH CHECK (
    auth.uid() = instructor_id
    AND instructor_id = (SELECT c.instructor_id FROM public.courses c WHERE c.id = courses.id)
);

-- Enrollments Policies
DROP POLICY IF EXISTS "Students can view their own enrollments." ON public.enrollments;
CREATE POLICY "Students can view their own enrollments." ON public.enrollments FOR SELECT
USING ( auth.uid() = student_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') );

DROP POLICY IF EXISTS "Students can enroll themselves." ON public.enrollments;
CREATE POLICY "Students can enroll themselves." ON public.enrollments FOR INSERT
WITH CHECK ( auth.uid() = student_id );

DROP POLICY IF EXISTS "Students can update their own enrollment progress." ON public.enrollments;
CREATE POLICY "Students can update their own enrollment progress." ON public.enrollments FOR UPDATE
USING ( auth.uid() = student_id )
WITH CHECK (
    auth.uid() = student_id
    AND student_id = (SELECT e.student_id FROM public.enrollments e WHERE e.id = enrollments.id)
    AND course_id = (SELECT e.course_id FROM public.enrollments e WHERE e.id = enrollments.id)
);

-- Messages Policies
DROP POLICY IF EXISTS "Anyone can insert a message." ON public.messages;
CREATE POLICY "Anyone can insert a message." ON public.messages FOR INSERT WITH CHECK ( true );

DROP POLICY IF EXISTS "Only admins can view messages." ON public.messages;
CREATE POLICY "Only admins can view messages." ON public.messages FOR SELECT
USING ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') );

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'student'::public.user_role
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_users INT;
  total_courses INT;
  total_enrollments INT;
  active_instructors INT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT count(*) INTO total_users FROM public.profiles;
  SELECT count(*) INTO total_courses FROM public.courses;
  SELECT count(*) INTO total_enrollments FROM public.enrollments;
  SELECT count(*) INTO active_instructors FROM public.instructors;

  RETURN json_build_object(
    'totalUsers', total_users,
    'totalCourses', total_courses,
    'totalEnrollments', total_enrollments,
    'activeInstructors', active_instructors
  );
END;
$$;

-- Sample Initial Courses
INSERT INTO public.courses (title, description, price, duration, level, is_published, image_url)
VALUES 
  ('Full-Stack Web Development Mastery', 'Build full-stack modern web applications from scratch with React, Node.js, and Supabase.', 149.00, '12 weeks', 'Intermediate', true, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'),
  ('Advanced UX/UI Design Systems', 'Master Figma design systems, component tokens, and user-centric digital interfaces.', 129.00, '8 weeks', 'All Levels', true, 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=800'),
  ('AI & Machine Learning Essentials', 'Practical deep dive into LLMs, neural networks, and modern AI engineering workflows.', 199.00, '10 weeks', 'Advanced', true, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800')
ON CONFLICT DO NOTHING;
