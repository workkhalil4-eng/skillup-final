import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Instructors", path: "/instructors" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-transparent">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background font-serif text-xl font-bold">
            S
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-foreground">
            SkillUp
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-foreground/80",
                  isActive ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center z-50 p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-background md:hidden flex flex-col p-6 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-xl font-semibold tracking-tight transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="h-px bg-border my-2 w-full" />
            <Link
              to="/login"
              className="text-lg font-medium text-foreground hover:text-primary"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-lg font-semibold text-primary-foreground shadow"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
