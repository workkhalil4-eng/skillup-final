import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import MainLayout from "./components/layout/MainLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Courses = lazy(() => import("./pages/Courses"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Instructors = lazy(() => import("./pages/Instructors"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Placeholder sub-pages for dashboard
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 bg-card rounded-2xl border border-border">
    <div className="text-center">
      <h3 className="text-2xl font-serif font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">This section is coming soon.</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Main Public Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Auth type="login" />} />
          <Route path="/register" element={<Auth type="register" />} />
        </Route>

        {/* Student Dashboard Layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<PlaceholderPage title="My Courses" />} />
          <Route path="progress" element={<PlaceholderPage title="Progress Tracker" />} />
          <Route path="certificates" element={<PlaceholderPage title="My Certificates" />} />
          <Route path="achievements" element={<PlaceholderPage title="Achievements" />} />
          <Route path="schedule" element={<PlaceholderPage title="Schedule" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
