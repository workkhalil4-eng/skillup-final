import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Settings,
  Calendar,
  BarChart2,
  Award,
  LogOut,
  Menu,
  X,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: BookOpen, label: "My Courses", path: "/dashboard/courses" },
  { icon: BarChart2, label: "Progress", path: "/dashboard/progress" },
  { icon: Award, label: "Certificates", path: "/dashboard/certificates" },
  { icon: Trophy, label: "Achievements", path: "/dashboard/achievements" },
  { icon: Calendar, label: "Schedule", path: "/dashboard/schedule" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-foreground/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 h-full w-64 flex-shrink-0 bg-foreground text-background transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-background/10">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-background font-serif text-lg font-bold">
              S
            </div>
            <span className="font-bold text-lg">SkillUp</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-background/60 hover:text-background"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-5 border-b border-background/10">
          <div className="flex items-center gap-3">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name || ""} className="h-10 w-10 rounded-full object-cover border border-background/20" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {profile?.full_name?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <p className="font-semibold text-sm line-clamp-1">{profile?.full_name || "SkillUp User"}</p>
              <p className="text-xs text-background/50 capitalize">{profile?.role || "Student"}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {sidebarLinks.map(({ icon: Icon, label, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === "/dashboard"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-background/60 hover:text-background hover:bg-background/10"
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-background/10 space-y-2">
          {profile?.role === 'admin' && (
            <button
              onClick={() => navigate("/admin")}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-orange-400 hover:text-orange-300 hover:bg-background/10 transition-colors"
            >
              <ShieldAlert className="h-4 w-4" />
              Admin Panel
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-background/60 hover:text-background hover:bg-background/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex items-center h-16 px-6 bg-background/80 backdrop-blur border-b border-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 text-foreground/60 hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold font-serif">Student Dashboard</h1>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
