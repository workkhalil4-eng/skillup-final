-- Migration: 01_security_fixes.sql
-- Description: Hardens RLS policies against privilege escalation, adds missing INSERT policies, and hardens search_path on SECURITY DEFINER functions.

-- 1a. Privilege escalation fix: Lock role column on user-initiated profile updates
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Users can update own profile."
    ON public.profiles FOR UPDATE
    USING ( auth.uid() = id )
    WITH CHECK (
        auth.uid() = id
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    );

-- Secure RPC for admins to change user roles
CREATE OR REPLACE FUNCTION public.admin_update_user_role(target_user_id UUID, new_role public.user_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.profiles
  SET role = new_role, updated_at = timezone('utc'::text, now())
  WHERE id = target_user_id;
END;
$$;

-- 1b. Missing INSERT policy on enrollments
DROP POLICY IF EXISTS "Students can enroll themselves." ON public.enrollments;

CREATE POLICY "Students can enroll themselves."
    ON public.enrollments FOR INSERT
    WITH CHECK ( auth.uid() = student_id );

-- 1c. Missing INSERT policy on instructors
DROP POLICY IF EXISTS "Users can register as instructor." ON public.instructors;

CREATE POLICY "Users can register as instructor."
    ON public.instructors FOR INSERT
    WITH CHECK (
        auth.uid() = id
        AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'instructor')
    );

-- 1d. Add WITH CHECK to remaining UPDATE policies (courses, enrollments, instructors)
DROP POLICY IF EXISTS "Instructors can update their own courses." ON public.courses;

CREATE POLICY "Instructors can update their own courses."
    ON public.courses FOR UPDATE
    USING ( auth.uid() = instructor_id )
    WITH CHECK (
        auth.uid() = instructor_id
        AND instructor_id = (SELECT c.instructor_id FROM public.courses c WHERE c.id = courses.id)
    );

DROP POLICY IF EXISTS "Students can update their own enrollment progress." ON public.enrollments;

CREATE POLICY "Students can update their own enrollment progress."
    ON public.enrollments FOR UPDATE
    USING ( auth.uid() = student_id )
    WITH CHECK (
        auth.uid() = student_id
        AND student_id = (SELECT e.student_id FROM public.enrollments e WHERE e.id = enrollments.id)
        AND course_id = (SELECT e.course_id FROM public.enrollments e WHERE e.id = enrollments.id)
    );

DROP POLICY IF EXISTS "Instructors can update own profile." ON public.instructors;

CREATE POLICY "Instructors can update own profile."
    ON public.instructors FOR UPDATE
    USING ( auth.uid() = id )
    WITH CHECK ( auth.uid() = id );

-- 1e. Harden SECURITY DEFINER functions with SET search_path = public
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

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
