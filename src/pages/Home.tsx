import { Link } from "react-router-dom";
import { Users, BookOpen, Star, GraduationCap, ArrowRight, Code2, Palette, TrendingUp, Briefcase, Brain, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const featuredCourses = [
  {
    slug: "advanced-product-design",
    title: "Advanced Product Design Strategy",
    description: "Learn how to design digital products that solve real problems.",
    price: 199,
    category: "Design",
    rating: 4.9,
    reviews: 120,
    instructor: "Sarah Jenkins",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    instructorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  },
  {
    slug: "fullstack-nextjs",
    title: "Full-Stack Next.js Mastery",
    description: "Build production-ready applications with Next.js & TypeScript.",
    price: 249,
    category: "Development",
    rating: 4.8,
    reviews: 85,
    instructor: "Alex Chen",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    instructorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
  {
    slug: "marketing-analytics",
    title: "Marketing Analytics for Startups",
    description: "Make data-driven marketing decisions that move the needle.",
    price: 149,
    category: "Marketing",
    rating: 4.7,
    reviews: 210,
    instructor: "Elena Rodriguez",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    instructorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
  },
];

const categories = [
  { icon: Code2, name: "Development", count: "18 courses" },
  { icon: Palette, name: "Design", count: "12 courses" },
  { icon: TrendingUp, name: "Marketing", count: "8 courses" },
  { icon: Briefcase, name: "Business", count: "5 courses" },
  { icon: Brain, name: "AI & Data", count: "6 courses" },
  { icon: Globe, name: "Languages", count: "4 courses" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ─── Hero ─── */}
      <section className="relative px-6 pt-12 pb-24 md:pt-20 md:pb-32 lg:px-8 overflow-hidden grain-bg bg-background-alt">
        <div className="mx-auto max-w-5xl relative">

          <h1 className="max-w-4xl font-serif text-6xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl leading-[1.05]">
            Learn the skills that move{" "}
            <span className="text-primary italic">careers</span>{" "}
            forward.
          </h1>

          <p className="mt-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
            Premium, no-fluff courses taught by operators from the teams you admire. Build real momentum in weeks, not years.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              to="/courses"
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-base font-medium text-background shadow-lg transition-all hover:bg-foreground/90 hover:shadow-xl hover:-translate-y-0.5"
            >
              Browse Courses
            </Link>
            <Link
              to="/about"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-transparent px-8 text-base font-medium text-foreground transition-colors hover:bg-foreground/5"
            >
              Learn More
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
                "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=64&h=64&q=80"
              ].map((src, i) => (
                <img key={i} src={src} alt="Student" className="h-10 w-10 rounded-full border-2 border-background object-cover" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Joined by <span className="font-semibold text-foreground">12,000+</span> professionals worldwide
            </p>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="mt-16 max-w-6xl mx-auto hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
            alt="Students learning together" 
            className="rounded-3xl shadow-2xl border border-border/50 w-full h-[400px] object-cover" 
          />
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-16 bg-foreground text-background">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Users, value: "12k+", label: "Students" },
            { icon: BookOpen, value: "45", label: "Courses" },
            { icon: GraduationCap, value: "30+", label: "Instructors" },
            { icon: Star, value: "4.9", label: "Avg. Rating" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="h-8 w-8 mb-3 text-primary" />
              <span className="text-4xl font-serif font-bold">{value}</span>
              <span className="text-sm text-background/60 mt-1 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Courses ─── */}
      <section className="py-24 container">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-3">Featured Courses</h2>
            <p className="text-muted-foreground max-w-lg text-lg">
              Curated programs designed to accelerate your career growth.
            </p>
          </div>
          <Button variant="outline" className="self-start md:self-auto rounded-full px-6" asChild>
            <Link to="/courses">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <Link key={course.slug} to={`/courses/${course.slug}`} className="block group">
              <Card className="h-full overflow-hidden border-border bg-card/50 transition-all duration-300 group-hover:bg-card group-hover:-translate-y-1 group-hover:shadow-lg">
                <div className="h-48 relative flex items-start p-4">
                  <img src={course.image} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  <span className="relative z-10 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {course.category}
                  </span>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium text-foreground">{course.rating}</span>
                    <span>({course.reviews} reviews)</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <img src={course.instructorImage} alt={course.instructor} className="h-7 w-7 rounded-full object-cover border border-border" />
                      <span className="text-sm font-medium">{course.instructor}</span>
                    </div>
                    <span className="font-bold text-lg">${course.price}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="py-24 bg-foreground/5 border-y border-border">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-3">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">Find the right learning path for your goals.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ icon: Icon, name, count }) => (
              <Link
                key={name}
                to="/courses"
                className="flex flex-col items-center gap-3 p-5 bg-background rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group text-center"
              >
                <Icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-semibold text-sm">{name}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
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
              <Star className="h-4 w-4 fill-primary" />
              Industry-Recognized Certificates
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              Earn credentials that employers actually recognize.
            </h2>
            <p className="text-background/70 text-lg mb-8">
              Complete any course and receive a verified certificate you can share on LinkedIn, add to your resume, and show to the world.
            </p>
            <Link
              to="/register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5"
            >
              Start for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
