import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Trophy, TrendingUp, CheckCircle2, Lock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface EnrolledCourse {
  course_id: string;
  progress: number;
  courses: {
    title: string;
    level: string;
  };
}

const achievements = [
  { icon: "🚀", title: "First Course", desc: "Enrolled in your first course", unlocked: true },
  { icon: "🔥", title: "On Fire", desc: "7-day learning streak", unlocked: true },
  { icon: "💡", title: "Quick Learner", desc: "Complete a course in under a week", unlocked: false },
  { icon: "🏆", title: "Top Performer", desc: "Score 100% on a quiz", unlocked: false },
  { icon: "📚", title: "Bookworm", desc: "Enroll in 5 courses", unlocked: false },
  { icon: "🎓", title: "Graduate", desc: "Complete your first course", unlocked: false },
];

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEnrollments() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select(`
            course_id,
            progress,
            courses (
              title,
              level
            )
          `)
          .eq('student_id', user.id)
          .order('enrolled_at', { ascending: false });

        if (error) throw error;
        if (data) setEnrollments(data as unknown as EnrolledCourse[]);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEnrollments();
  }, [user]);

  const firstName = profile?.full_name?.split(' ')[0] || 'Student';
  const avgProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc, curr) => acc + curr.progress, 0) / enrollments.length) 
    : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-3xl font-serif font-bold mb-1">Good morning, {firstName}! 👋</h2>
        <p className="text-muted-foreground">You have {enrollments.length} courses in progress. Keep going!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Courses Enrolled", value: enrollments.length.toString(), color: "text-blue-500" },
          { icon: CheckCircle2, label: "Lessons Completed", value: "24", color: "text-green-500" }, // Mocked for now
          { icon: Trophy, label: "Achievements", value: "2 / 6", color: "text-yellow-500" }, // Mocked for now
          { icon: TrendingUp, label: "Avg. Progress", value: `${avgProgress}%`, color: "text-primary" },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="border-border bg-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-2.5 rounded-xl bg-muted ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold font-serif">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* My Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold">My Courses</h3>
          </div>
          {enrollments.length === 0 ? (
             <Card className="border-border bg-card">
               <CardContent className="p-8 text-center">
                 <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                 <Link to="/courses" className="text-primary font-medium hover:underline">Browse Courses</Link>
               </CardContent>
             </Card>
          ) : enrollments.map((enrollment) => (
            <Card key={enrollment.course_id} className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{enrollment.courses?.level || 'Beginner'}</span>
                    <h4 className="font-semibold mt-2 line-clamp-1">{enrollment.courses?.title || 'Unknown Course'}</h4>
                  </div>
                  <span className="text-sm font-bold text-primary whitespace-nowrap">{enrollment.progress}%</span>
                </div>
                {/* Progress Bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    In progress
                  </span>
                  <Link
                    to={`/courses/${enrollment.course_id}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Continue →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((a) => (
                  <div
                    key={a.title}
                    title={a.desc}
                    className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border text-center cursor-help transition-all ${
                      a.unlocked
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-muted/50 opacity-50 grayscale"
                    }`}
                  >
                    <span className="text-2xl">{a.icon}</span>
                    <span className="text-[10px] font-medium leading-tight line-clamp-2">{a.title}</span>
                    {!a.unlocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
