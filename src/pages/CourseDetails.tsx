import { useParams } from "react-router-dom";
import { Star, Video, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CourseDetails() {
  const { slug: _slug } = useParams();

  // Mock course data
  const course = {
    title: "Advanced Product Design Strategy",
    description: "Learn how to design digital products that solve real problems and drive business value. This course covers everything from user research to advanced prototyping and design systems.",
    price: 199,
    category: "Design",
    rating: 4.9,
    reviews: 120,
    instructor: { name: "Sarah Jenkins", role: "Design Lead at Acme" },
    curriculum: [
      { id: "1", title: "Introduction to Product Strategy", duration: "15 mins", type: "video" },
      { id: "2", title: "User Research Fundamentals", duration: "45 mins", type: "video" },
      { id: "3", title: "Synthesizing Data into Insights", duration: "30 mins", type: "video" },
      { id: "4", title: "Prototyping Complex Workflows", duration: "1 hour", type: "video" },
      { id: "5", title: "Design Systems at Scale", duration: "1.5 hours", type: "video" },
      { id: "6", title: "Final Project & Review", duration: "Project", type: "assignment" },
    ]
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-foreground text-background py-16 md:py-24">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-6">
              {course.category}
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
                <span className="font-bold">{course.rating}</span>
              </div>
              <span className="text-background/60">({course.reviews} reviews)</span>
              <span className="text-background/60">•</span>
              <span>Taught by <span className="font-bold">{course.instructor.name}</span></span>
            </div>
            <div className="flex items-center gap-4">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                Enroll Now - ${course.price}
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-transparent border-background/20 text-background hover:bg-background/10">
                Add to Wishlist
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-background/10 rounded-3xl overflow-hidden border border-background/20 flex items-center justify-center">
               <Video className="h-16 w-16 text-background/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 md:py-24 container max-w-4xl">
        <h2 className="text-3xl font-serif font-bold mb-8">Course Curriculum</h2>
        <div className="space-y-4">
          {course.curriculum.map((lesson, idx) => (
            <div key={lesson.id} className="flex items-center justify-between p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-muted-foreground font-bold font-serif">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{lesson.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    {lesson.type === 'video' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              </div>
              <CheckCircle2 className="h-6 w-6 text-muted-foreground/30" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
