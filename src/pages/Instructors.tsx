import { Card, CardContent } from "@/components/ui/card";

const MOCK_INSTRUCTORS = [
  { id: "1", name: "Sarah Jenkins", role: "Design Lead at Acme", students: "12k", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
  { id: "2", name: "Alex Chen", role: "Senior Engineer at TechCo", students: "8.5k", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { id: "3", name: "Elena Rodriguez", role: "Growth Marketer", students: "15k", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
  { id: "4", name: "Marcus Doe", role: "Animation Specialist", students: "5k", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
];

export default function Instructors() {
  return (
    <div className="container py-12 md:py-24">
      <div className="mb-12 md:text-center max-w-3xl md:mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Our Instructors</h1>
        <p className="text-xl text-muted-foreground">Learn directly from operators who have built products you use every day.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {MOCK_INSTRUCTORS.map((instructor) => (
          <Card key={instructor.id} className="overflow-hidden border-border bg-card/50 transition-colors hover:bg-card">
            <div className="h-64 relative border-b border-border">
              <img src={instructor.image} alt={instructor.name} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <CardContent className="p-6 text-center">
              <h3 className="font-serif text-2xl font-bold mb-1">{instructor.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{instructor.role}</p>
              <div className="text-sm font-medium">
                {instructor.students} Students
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
