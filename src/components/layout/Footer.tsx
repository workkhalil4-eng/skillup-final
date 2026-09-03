import { Link } from "react-router-dom";
import { BookOpen, MessageCircle, Code, Rss } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground font-serif text-xl font-bold">
                S
              </div>
              <span className="font-sans text-xl font-bold tracking-tight">SkillUp</span>
            </div>
            <p className="text-background/60 max-w-xs leading-relaxed">
              Premium, no-fluff courses taught by operators from the teams you admire. Build real momentum in weeks, not years.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-background/50 hover:text-primary transition-colors"><MessageCircle className="h-5 w-5" /></a>
              <a href="#" className="text-background/50 hover:text-primary transition-colors"><Code className="h-5 w-5" /></a>
              <a href="#" className="text-background/50 hover:text-primary transition-colors"><Rss className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-background/50">Platform</h4>
            <ul className="space-y-3">
              {[
                [t('nav.courses'), "/courses"],
                [t('nav.instructors'), "/instructors"],
                [t('nav.pricing'), "/pricing"],
                [t('nav.about'), "/about"]
              ].map(([name, path]) => (
                <li key={path}><Link to={path} className="text-background/70 hover:text-background transition-colors">{name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-background/50">Support</h4>
            <ul className="space-y-3">
              {[
                [t('nav.contact'), "/contact"],
                [t('nav.login'), "/login"],
                [t('nav.signup'), "/register"]
              ].map(([name, path]) => (
                <li key={path}><Link to={path} className="text-background/70 hover:text-background transition-colors">{name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/40 text-sm">© 2025 SkillUp. All rights reserved.</p>
          <div className="flex items-center gap-2 text-background/40 text-sm">
            <BookOpen className="h-4 w-4" />
            <span>Built for learners worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
