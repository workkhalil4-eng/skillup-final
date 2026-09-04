import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { session, profile, signOut } = useAuth();

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.courses"), path: "/courses" },
    { name: t("nav.instructors"), path: "/instructors" },
    { name: t("nav.pricing"), path: "/pricing" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const firstName = profile?.full_name?.split(" ")[0] || session?.user?.email?.split("@")[0] || "Account";

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-transparent" role="navigation" aria-label="Main navigation">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-50" aria-label="SkillUp Home">
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
            const isActive =
              location.pathname === link.path ||
              (link.path !== "/" && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-foreground/80",
                  isActive ? "text-foreground" : "text-foreground/60"
                )}
                aria-current={isActive ? "page" : undefined}
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
          <button
            onClick={toggleLanguage}
            className="p-2 text-foreground/80 hover:text-foreground transition-colors"
            aria-label={i18n.language === "en" ? "Switch to Arabic" : "Switch to English"}
          >
            <Globe className="h-5 w-5" aria-hidden="true" />
          </button>

          {session ? (
            /* Logged-in user menu */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {firstName[0]?.toUpperCase()}
                </div>
                <span>{firstName}</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", userMenuOpen && "rotate-180")} aria-hidden="true" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg py-1 z-50"
                  role="menu"
                >
                  <Link
                    to={profile?.role === "admin" ? "/admin" : "/dashboard"}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                    role="menuitem"
                  >
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                    {t("nav.dashboard")}
                  </Link>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    {t("nav.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest buttons */
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/register"
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {t("nav.signup")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center z-50 gap-2">
          <button
            onClick={toggleLanguage}
            className="p-2 text-foreground"
            aria-label={i18n.language === "en" ? "Switch to Arabic" : "Switch to English"}
          >
            <Globe className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            className="p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-background md:hidden flex flex-col p-6 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path !== "/" && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-xl font-semibold tracking-tight transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="h-px bg-border my-2 w-full" />

            {session ? (
              <>
                <Link
                  to={profile?.role === "admin" ? "/admin" : "/dashboard"}
                  className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary"
                >
                  <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
                  {t("nav.dashboard")}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-lg font-medium text-destructive hover:text-destructive/80 text-left"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-lg font-medium text-foreground hover:text-primary"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-lg font-semibold text-primary-foreground shadow"
                >
                  {t("nav.signup")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
