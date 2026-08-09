import { useState } from "react";
import { Search, Star, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

// Mock data for courses
const MOCK_COURSES = [
  {
    id: "1",
    slug: "advanced-product-design",
    title: "Advanced Product Design Strategy",
    description: "Learn how to design digital products that solve real problems and drive business value.",
    price: 199,
    category: "Design",
    rating: 4.9,
    reviews: 120,
    instructor: "Sarah Jenkins",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    instructorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "2",
    slug: "fullstack-nextjs",
    title: "Full-Stack Next.js Mastery",
    description: "Build production-ready applications with Next.js, React, and TypeScript.",
    price: 249,
    category: "Development",
    rating: 4.8,
    reviews: 85,
    instructor: "Alex Chen",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    instructorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "3",
    slug: "marketing-analytics",
    title: "Marketing Analytics for Startups",
    description: "Understand your growth metrics and make data-driven marketing decisions.",
    price: 149,
    category: "Marketing",
    rating: 4.7,
    reviews: 210,
    instructor: "Elena Rodriguez",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    instructorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "4",
    slug: "ui-animation-framer",
    title: "UI Animation with Framer Motion",
    description: "Create delightful and performant web animations that feel natural.",
    price: 129,
    category: "Design",
    rating: 4.9,
    reviews: 340,
    instructor: "Marcus Doe",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
    instructorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "5",
    slug: "backend-go",
    title: "Scalable Backends with Go",
    description: "Design and build high-performance distributed systems using Go.",
    price: 299,
    category: "Development",
    rating: 4.6,
    reviews: 95,
    instructor: "David Kim",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    instructorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
  },
];

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = MOCK_COURSES.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-12 md:py-24">
      <div className="mb-12 md:text-center max-w-3xl md:mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Explore Courses</h1>
        <p className="text-xl text-muted-foreground">Find the perfect program to advance your skills. Taught by industry experts.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search courses, descriptions, or instructors..." 
            className="pl-10 h-12 rounded-full bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-full px-6 gap-2">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Link key={course.id} to={`/courses/${course.slug}`} className="block group">
              <Card className="h-full overflow-hidden border-border bg-card/50 transition-colors group-hover:bg-card">
                <div className="h-48 relative flex items-start p-4">
                  <img src={course.image} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  <div className="relative z-10 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {course.category}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium text-foreground">{course.rating}</span>
                    <span>({course.reviews} reviews)</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                      <img src={course.instructorImage} alt={course.instructor} className="h-8 w-8 rounded-full object-cover border border-border" />
                      <span className="text-sm font-medium">{course.instructor}</span>
                    </div>
                    <div className="font-bold text-lg">${course.price}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card/30 rounded-3xl border border-border">
          <h3 className="text-2xl font-serif font-bold mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}
