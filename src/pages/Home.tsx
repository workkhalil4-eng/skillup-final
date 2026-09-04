import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Users, BookOpen, Star, GraduationCap, ArrowRight, Code2, Palette, TrendingUp, Briefcase, Brain, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  image_url: string;
  instructor_name?: string;
  instructor_avatar?: string;
}

const categories = [
  { icon: Code2, name: "Development", count: "courses" },
  { icon: Palette, name: "Design", count: "courses" },
  { icon: TrendingUp, name: "Marketing", count: "courses" },
  { icon: Briefcase, name: "Business", count: "courses" },
  { icon: Brain, name: "AI & Data", count: "courses" },
  { icon: Globe, name: "Languages", count: "courses" },
];

export default function Home() {
  const { t } = useTranslation();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({ courses: 0, students: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch featured courses (up to 3)
        const { data: coursesData } = await supabase
          .from("courses")
          .select(`
            id,
            title,
            description,
            price,
            level,
            image_url,
            instructors (
              profiles (
                full_name,
                avatar_url
              )
            )
          `)
          .eq("is_published", true)
          .limit(3);

        if (coursesData) {
          setFeaturedCourses(
            coursesData.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description || "",
              price: item.price,
              level: item.level || "All Levels",
              image_url:
                item.image_url ||
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
              instructor_name:
                item.instructors?.profiles?.full_name || "SkillUp Instructor",
              instructor_avatar:
                item.instructors?.profiles?.avatar_url ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
            }))
          );
          setStats((prev) => ({ ...prev, courses: coursesData.length }));
        }

        // Fetch total enrollments count
        const { count: enrollCount } = await supabase
          .from("enrollments")
          .select("id", { count: "exact", head: true });

        setStats((prev) => ({
          ...prev,
          students: enrollCount ?? 0,
        }));
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      {/* ─── Hero ─── */}
      <section className="relative px-6 pt-12 pb-24 md:pt-20 md:pb-32 lg:px-8 overflow-hidden grain-bg bg-background-alt">
        <div className="mx-auto max-w-5xl relative">
          <h1 className="max-w-4xl font-serif text-6xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl leading-[1.05]">
            {t("hero.title")}
          </h1>

          <p className="mt-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              to="/courses"
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-base font-medium text-background shadow-lg transition-all hover:bg-foreground/90 hover:shadow-xl hover:-translate-y-0.5"
            >
              {t("hero.cta1")}
            </Link>
            <Link
              to="/about"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-transparent px-8 text-base font-medium text-foreground transition-colors hover:bg-foreground/5"
            >
              {t("hero.cta2")}
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64&q=80",
                "https://images.unsplash.com/photo-1488161628813-04466f8724a6?auto=format&fit=crop&w=64&h=64&q=80",
                "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=64&h=64&q=80",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Student ${i + 1}`}
                  className="h-10 w-10 rounded-full border-2 border-background object-cover"
                  loading="lazy"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("hero.socialProof")}
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-16 max-w-6xl mx-auto hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
            alt="Students learning together"
            className="rounded-3xl shadow-2xl border border-border/50 w-full h-[400px] object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-16 bg-foreground text-background">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Users, value: stats.students > 0 ? `${stats.students}+` : "—", label: t("stats.students") },
            { icon: BookOpen, value: stats.courses > 0 ? `${stats.courses}+` : "—", label: t("stats.courses") },
            { icon: GraduationCap, value: "30+", label: t("stats.instructors") },
            { icon: Star, value: "4.9", label: t("stats.rating") },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="h-8 w-8 mb-3 text-primary" aria-hidden="true" />
              <span className="text-4xl font-serif font-bold">{value}</span>
              <span className="text-sm text-background/60 mt-1 uppercase tracking-wider">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Courses ─── */}
      <section className="py-24 container">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-3">
              {t("home.featuredTitle")}
            </h2>
            <p className="text-muted-foreground max-w-lg text-lg">
              {t("home.featuredSubtitle")}
            </p>
          </div>
          <Button variant="outline" className="self-start md:self-auto rounded-full px-6" asChild>
            <Link to="/courses">
              {t("home.viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`} className="block group">
                <Card className="h-full overflow-hidden border-border bg-card/50 transition-all duration-300 group-hover:bg-card group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className="h-48 relative flex items-start p-4">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    <span className="relative z-10 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      {course.level}
                    </span>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                      <span className="font-medium text-foreground">New</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <img
                          src={course.instructor_avatar}
                          alt={course.instructor_name}
                          className="h-7 w-7 rounded-full object-cover border border-border"
                          loading="lazy"
                        />
                        <span className="text-sm font-medium">{course.instructor_name}</span>
                      </div>
                      <span className="font-bold text-lg">${course.price}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── Categories ─── */}
      <section className="py-24 bg-foreground/5 border-y border-border">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-3">
              {t("home.categoriesTitle")}
            </h2>
            <p className="text-muted-foreground text-lg">{t("home.categoriesSubtitle")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ icon: Icon, name }) => (
              <Link
                key={name}
                to="/courses"
                className="flex flex-col items-center gap-3 p-5 bg-background rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group text-center"
                aria-label={`Browse ${name} courses`}
              >
                <Icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                <span className="font-semibold text-sm">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Certificate CTA ─── */}
      <section className="py-24 container">
        <div className="relative overflow-hidden bg-foreground text-background rounded-3xl p-12 md:p-16">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <Star className="h-4 w-4 fill-primary" aria-hidden="true" />
              {t("home.certBadge")}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              {t("home.certTitle")}
            </h2>
            <p className="text-background/70 text-lg mb-8">{t("home.certSubtitle")}</p>
            <Link
              to="/register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5"
            >
              {t("home.certCta")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
