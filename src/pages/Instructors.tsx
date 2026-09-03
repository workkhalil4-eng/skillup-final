import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Instructor {
  id: string;
  name: string;
  bio: string;
  image: string;
  students: number;
}

export default function Instructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInstructors() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('instructors')
          .select(`
            id,
            bio,
            students_count,
            profiles (
              full_name,
              avatar_url
            )
          `);

        if (error) throw error;

        if (data) {
          const transformed = data.map((item: any) => ({
            id: item.id,
            name: item.profiles?.full_name || "Unknown Instructor",
            bio: item.bio || "Instructor",
            students: item.students_count || 0,
            image: item.profiles?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
          }));
          setInstructors(transformed);
        }
      } catch (err: any) {
        console.error("Error fetching instructors:", err);
        setError("Failed to load instructors.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchInstructors();
  }, []);

  return (
    <div className="container py-12 md:py-24">
      <div className="mb-12 md:text-center max-w-3xl md:mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Our Instructors</h1>
        <p className="text-xl text-muted-foreground">Learn directly from operators who have built products you use every day.</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8 text-center">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : instructors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {instructors.map((instructor) => (
            <Card key={instructor.id} className="overflow-hidden border-border bg-card/50 transition-colors hover:bg-card">
              <div className="h-64 relative border-b border-border">
                <img src={instructor.image} alt={instructor.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="font-serif text-2xl font-bold mb-1">{instructor.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{instructor.bio}</p>
                <div className="text-sm font-medium text-primary">
                  {instructor.students} Students
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No instructors found.
        </div>
      )}
    </div>
  );
}
