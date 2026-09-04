import { useState, useEffect } from "react";
import { Search, Star, Filter, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  level: string;
  instructor_id: string;
  instructor_name?: string;
  instructor_avatar?: string;
}

export default function Courses() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true);
        // Assuming your schema allows nested select through instructors to profiles
        const { data, error } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            image_url,
            price,
            level,
            instructor_id,
            instructors (
              id,
              profiles (
                full_name,
                avatar_url
              )
            )
          `)
          .eq('is_published', true);

        if (error) throw error;
        
        // Transform the nested data
        if (data) {
          const transformedCourses = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image_url: item.image_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
            price: item.price,
            level: item.level || "Beginner",
            instructor_id: item.instructor_id,
            instructor_name: item.instructors?.profiles?.full_name || "Unknown Instructor",
            instructor_avatar: item.instructors?.profiles?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
          }));
          setCourses(transformedCourses);
        }
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.instructor_name && course.instructor_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container py-12 md:py-24">
      <div className="mb-12 md:text-center max-w-3xl md:mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">{t("courses.title")}</h1>
        <p className="text-xl text-muted-foreground">{t("courses.subtitle")}</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder={t("courses.searchPlaceholder")}
            className="pl-10 h-12 rounded-full bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t("courses.searchPlaceholder")}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-full px-6 gap-2" aria-label={t("courses.filters")}>
          <Filter className="h-4 w-4" aria-hidden="true" /> {t("courses.filters")}
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      {/* Course Grid */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`} className="block group">
              <Card className="h-full overflow-hidden border-border bg-card/50 transition-colors group-hover:bg-card">
                <div className="h-48 relative flex items-start p-4">
                  <img src={course.image_url} alt={course.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  <div className="relative z-10 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {course.level}
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-1 h-[calc(100%-12rem)]">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                    <span className="font-medium text-foreground">4.8</span>
                    <span>({t("courses.new")})</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">{course.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <img src={course.instructor_avatar} alt={course.instructor_name} className="h-8 w-8 rounded-full object-cover border border-border" loading="lazy" />
                      <span className="text-sm font-medium">{course.instructor_name}</span>
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
          <h3 className="text-2xl font-serif font-bold mb-2">{t("courses.noResults")}</h3>
          <p className="text-muted-foreground">{t("courses.noResultsHint")}</p>
        </div>
      )}
    </div>
  );
}
