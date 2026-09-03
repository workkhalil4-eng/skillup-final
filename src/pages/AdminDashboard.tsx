import { ShieldCheck, Users, MessageSquare, RefreshCw, Download, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeInstructors: number;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      // Fetch aggregate stats using the secure RPC function
      const { data: statsData, error: statsError } = await supabase.rpc('get_admin_stats');
      if (statsError) throw statsError;
      if (statsData) setStats(statsData as unknown as AdminStats);

      // Fetch recent messages
      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (msgError) throw msgError;
      if (msgData) setMessages(msgData);

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error("Error fetching admin data:", err);
      setError("Failed to load dashboard data. Ensure you have admin privileges and migrations are applied.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExport = (format: "json" | "csv") => {
    if (format === "json") {
      const blob = new Blob([JSON.stringify(messages, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "messages.json"; a.click();
    } else {
      const BOM = "\uFEFF";
      const headers = "Name,Email,Subject,Message,Time";
      const rows = messages.map(m =>
        `"${m.name}","${m.email}","${m.subject}","${m.message.replace(/"/g, '""')}","${new Date(m.created_at).toLocaleString()}"`
      );
      const blob = new Blob([BOM + [headers, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "messages.csv"; a.click();
    }
  };

  const rlsPolicies = [
    { table: "profiles", count: 3, summary: "SELECT (public), INSERT (self), UPDATE (self)" },
    { table: "courses", count: 3, summary: "SELECT (public), INSERT (instructor), UPDATE (instructor)" },
    { table: "enrollments", count: 2, summary: "SELECT (student/admin), UPDATE (student)" },
    { table: "messages", count: 3, summary: "INSERT (public), SELECT (admin), UPDATE (admin)" },
  ];

  if (!stats && isRefreshing) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">Last updated: {lastUpdated}</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isRefreshing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600"><Users className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold font-serif">{stats?.totalUsers || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-orange-100 text-primary"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold font-serif">{stats?.totalCourses || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-green-100 text-green-600"><Users className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Enrollments</p>
              <p className="text-2xl font-bold font-serif">{stats?.totalEnrollments || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600"><Users className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Active Instructors</p>
              <p className="text-2xl font-bold font-serif">{stats?.activeInstructors || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* RLS Policies - Reflecting actual DB schema */}
        <Card className="border-border col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Configured RLS Policies</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rlsPolicies.map(({ table, count, summary }) => (
              <div key={table} className="p-3 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm font-bold">{table}</span>
                  <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">{count} policies</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Recent Contact Messages</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => handleExport("json")} disabled={messages.length === 0}>
                <Download className="h-3 w-3" /> JSON
              </Button>
              <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => handleExport("csv")} disabled={messages.length === 0}>
                <Download className="h-3 w-3" /> CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Name</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Email</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Subject</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Message</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">No messages found.</td>
                  </tr>
                ) : messages.map((msg) => (
                  <tr key={msg.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-medium">{msg.name}</td>
                    <td className="py-3 px-3 text-muted-foreground font-mono text-xs">{msg.email}</td>
                    <td className="py-3 px-3 text-muted-foreground max-w-[150px] truncate">{msg.subject}</td>
                    <td className="py-3 px-3 text-muted-foreground max-w-xs truncate">{msg.message}</td>
                    <td className="py-3 px-3 text-muted-foreground text-xs whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
