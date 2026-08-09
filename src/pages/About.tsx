export default function About() {
  return (
    <div className="container py-12 md:py-24">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Empowering the next generation of builders.</h1>
        <p className="text-xl text-muted-foreground">
          SkillUp is on a mission to bridge the gap between traditional education and the skills required in the modern tech industry. We believe in learning by doing.
        </p>
      </div>

      {/* Bento Grid Values */}
      <div className="mb-24">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
          <div className="md:col-span-2 md:row-span-2 bg-card border border-border rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
            <div className="relative z-20">
              <h3 className="text-3xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">Radical Candor</h3>
              <p className="text-muted-foreground text-lg">We communicate openly, honestly, and directly. We challenge directly but care personally.</p>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-muted rounded-3xl p-8 flex flex-col justify-center border border-border">
            <h3 className="text-2xl font-serif font-bold mb-2">Build for Real</h3>
            <p className="text-muted-foreground">Theory is good. Practice is better. Building real projects is best.</p>
          </div>
          
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-serif font-bold mb-2">Move Fast</h3>
            <p className="text-primary-foreground/80 text-sm">Momentum over perfection.</p>
          </div>
          
          <div className="bg-foreground text-background rounded-3xl p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-serif font-bold mb-2">Stay Curious</h3>
            <p className="text-background/70 text-sm">Always be learning.</p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-muted mb-4 border-2 border-border" />
              <h4 className="font-bold text-lg">Team Member {i}</h4>
              <p className="text-muted-foreground text-sm">Co-founder & Role</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
