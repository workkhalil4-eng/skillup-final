import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, Video, FileText, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  duration: string;
  image_url: string;
  instructor_id: string | null;
  instructor_name?: string;
  instructor_avatar?: string;
}

// Placeholder curriculum — would come from a lessons table in a full implementation
const PLACEHOLDER_CURRICULUM = [
  { id: "1", title: "Introduction & Overview", duration: "15 mins", type: "video" },
  { id: "2", title: "Core Concepts Deep Dive", duration: "45 mins", type: "video" },
  { id: "3", title: "Hands-on Project Setup", duration: "30 mins", type: "video" },
  { id: "4", title: "Advanced Techniques", duration: "1 hour", type: "video" },
  { id: "5", title: "Real-world Application", duration: "1.5 hours", type: "video" },
  { id: "6", title: "Final Project & Review", duration: "Project", type: "assignment" },
];

export default function CourseDetails() {
  const { slug: courseId } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      if (!courseId) return;
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("courses")
          .select(`
            id,
            title,
            description,
            price,
            level,
            duration,
            image_url,
            instructor_id,
            instructors (
              id,
              profiles (
                full_name,
                avatar_url
              )
            )
          `)
          .eq("id", courseId)
          .single();

        if (error) throw error;

        if (data) {
          const item = data as any;
          setCourse({
            id: item.id,
            title: item.title,
            description: item.description || "",
            price: item.price,
            level: item.level || "All Levels",
            duration: item.duration || "Self-paced",
            image_url:
              item.image_url ||
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
            instructor_id: item.instructor_id,
            instructor_name:
              item.instructors?.profiles?.full_name || "SkillUp Instructor",
            instructor_avatar:
              item.instructors?.profiles?.avatar_url ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
          });
        }
      } catch (err: any) {
        console.error("Error fetching course:", err);
        setError("Course not found or failed to load.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-3xl font-serif font-bold mb-4">Course Not Found</h1>
        <p className="text-muted-foreground mb-8">
          {error || "This course doesn't exist or has been removed."}
        </p>
        <Button asChild>
          <Link to="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-foreground text-background py-16 md:py-24">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-6">
              {course.level}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              {course.title}
            </h1>
            <p className="text-xl text-background/80 mb-8 max-w-xl">
              {course.description}
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1 text-primary">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-bold">New</span>
              </div>
              <span className="text-background/60">•</span>
              <span className="text-background/80">{course.duration}</span>
              <span className="text-background/60">•</span>
              <span>
                Taught by{" "}
                <span className="font-bold">{course.instructor_name}</span>
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  disabled
                  className="h-14 px-8 text-lg rounded-full opacity-60 cursor-not-allowed"
                  aria-label="Enrollment disabled for portfolio preview"
                >
                  Enroll Now — ${course.price}
                </Button>
                <Button
                  size="lg"
                  disabled
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-full bg-transparent border-background/20 text-background opacity-60 cursor-not-allowed"
                  aria-label="Wishlist disabled for portfolio preview"
                >
                  Add to Wishlist
                </Button>
              </div>
              <p className="text-xs text-background/60">
                Note: Enrollment and checkout are disabled in this illustrative
                portfolio preview.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-3xl overflow-hidden border border-background/20">
              <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-full object-cover opacity-80"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 md:py-24 container max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold">Course Curriculum</h2>
          <Link
            to="/courses"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> All Courses
          </Link>
        </div>
        <div className="space-y-4">
          {PLACEHOLDER_CURRICULUM.map((lesson, idx) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-muted-foreground font-bold font-serif">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{lesson.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    {lesson.type === "video" ? (
                      <Video className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <FileText className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              </div>
              <CheckCircle2 className="h-6 w-6 text-muted-foreground/30" aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
