import { Link } from "react-router-dom";
import { BookOpen, Clock, Trophy, TrendingUp, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const enrolledCourses = [
  { slug: "advanced-product-design", title: "Advanced Product Design Strategy", progress: 65, category: "Design" },
  { slug: "fullstack-nextjs", title: "Full-Stack Next.js Mastery", progress: 30, category: "Development" },
  { slug: "marketing-analytics", title: "Marketing Analytics for Startups", progress: 10, category: "Marketing" },
];

const recentCourses = enrolledCourses.slice(0, 3);

const achievements = [
  { icon: "🚀", title: "First Course", desc: "Enrolled in your first course", unlocked: true },
  { icon: "🔥", title: "On Fire", desc: "7-day learning streak", unlocked: true },
  { icon: "💡", title: "Quick Learner", desc: "Complete a course in under a week", unlocked: false },
  { icon: "🏆", title: "Top Performer", desc: "Score 100% on a quiz", unlocked: false },
  { icon: "📚", title: "Bookworm", desc: "Enroll in 5 courses", unlocked: false },
  { icon: "🎓", title: "Graduate", desc: "Complete your first course", unlocked: false },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-3xl font-serif font-bold mb-1">Good morning, John! 👋</h2>
        <p className="text-muted-foreground">You have 3 courses in progress. Keep going!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Courses Enrolled", value: "3", color: "text-blue-500" },
          { icon: CheckCircle2, label: "Lessons Completed", value: "24", color: "text-green-500" },
          { icon: Trophy, label: "Achievements", value: "2 / 6", color: "text-yellow-500" },
          { icon: TrendingUp, label: "Avg. Progress", value: "35%", color: "text-primary" },
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
            <Link to="/dashboard/courses" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {enrolledCourses.map((course) => (
            <Card key={course.slug} className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{course.category}</span>
                    <h4 className="font-semibold mt-2 line-clamp-1">{course.title}</h4>
                  </div>
                  <span className="text-sm font-bold text-primary whitespace-nowrap">{course.progress}%</span>
                </div>
                {/* Progress Bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    {Math.round((course.progress / 100) * 6)} / 6 lessons
                  </span>
                  <Link
                    to={`/courses/${course.slug}`}
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
          {/* Recently Viewed */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recently Viewed</h3>
            </div>
            <div className="space-y-3">
              {recentCourses.map((c) => (
                <Link
                  key={c.slug}
                  to={`/courses/${c.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-muted border border-border shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.progress}% complete</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

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

          {/* Deadlines */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { task: "Final Project - Product Design", date: "Aug 5, 2025", late: false },
                { task: "Quiz – Analytics Basics", date: "Jul 30, 2025", late: true },
              ].map((d) => (
                <div key={d.task} className="flex items-start justify-between gap-2">
                  <p className="text-sm line-clamp-2">{d.task}</p>
                  <span className={`text-xs shrink-0 font-medium px-2 py-0.5 rounded-full ${d.late ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"}`}>
                    {d.date}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
