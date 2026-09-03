-- Enum for User Roles
CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin');

-- 1. Profiles Table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role public.user_role DEFAULT 'student'::public.user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Instructors Profile extension (Optional but good for instructor specific data)
CREATE TABLE public.instructors (
    id UUID REFERENCES public.profiles(id) PRIMARY KEY,
    bio TEXT,
    expertise TEXT[],
    rating DECIMAL(3,2) DEFAULT 0.0,
    students_count INTEGER DEFAULT 0
);

-- 3. Courses Table
CREATE TABLE public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instructor_id UUID REFERENCES public.instructors(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration TEXT,
    level TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enrollments Table
CREATE TABLE public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) NOT NULL,
    course_id UUID REFERENCES public.courses(id) NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, course_id)
);

-- 5. Messages (Contact Form) Table
CREATE TABLE public.messages (
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

-- Profiles RLS
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.profiles FOR SELECT
    USING ( true );

CREATE POLICY "Users can insert their own profile."
    ON public.profiles FOR INSERT
    WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
    ON public.profiles FOR UPDATE
    USING ( auth.uid() = id );

-- Instructors RLS
CREATE POLICY "Instructor profiles are viewable by everyone."
    ON public.instructors FOR SELECT
    USING ( true );

CREATE POLICY "Instructors can update own profile."
    ON public.instructors FOR UPDATE
    USING ( auth.uid() = id );

-- Courses RLS
CREATE POLICY "Published courses are viewable by everyone."
    ON public.courses FOR SELECT
    USING ( is_published = true OR auth.uid() = instructor_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') );

CREATE POLICY "Instructors can insert their own courses."
    ON public.courses FOR INSERT
    WITH CHECK ( auth.uid() = instructor_id AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'instructor') );

CREATE POLICY "Instructors can update their own courses."
    ON public.courses FOR UPDATE
    USING ( auth.uid() = instructor_id );

-- Enrollments RLS
CREATE POLICY "Students can view their own enrollments."
    ON public.enrollments FOR SELECT
    USING ( auth.uid() = student_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') );

CREATE POLICY "Students can update their own enrollment progress."
    ON public.enrollments FOR UPDATE
    USING ( auth.uid() = student_id );

-- Messages RLS
CREATE POLICY "Anyone can insert a message."
    ON public.messages FOR INSERT
    WITH CHECK ( true );

CREATE POLICY "Only admins can view messages."
    ON public.messages FOR SELECT
    USING ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') );

CREATE POLICY "Only admins can update messages."
    ON public.messages FOR UPDATE
    USING ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') );


-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'student'::public.user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RPC for Admin Stats (Runs as security definer to bypass RLS for aggregate stats if needed, or relies on admin access)
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_users INT;
  total_courses INT;
  total_enrollments INT;
  active_instructors INT;
BEGIN
  -- Verify admin role
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
