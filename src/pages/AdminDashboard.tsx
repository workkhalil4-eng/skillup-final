import { ShieldCheck, Users, MessageSquare, RefreshCw, Download } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock admin data
const mockData = {
  roles: [
    { role: "student", count: 11850 },
    { role: "instructor", count: 32 },
    { role: "admin", count: 3 },
  ],
  messages: {
    total: 248,
    last24h: 12,
  },
  recentMessages: [
    { name: "Ahmed K.", email: "a****@gmail.com", message: "I have a question about the Product Design course...", time: "2 mins ago" },
    { name: "Sara M.", email: "s****@hotmail.com", message: "The payment page is not loading for me.", time: "15 mins ago" },
    { name: "John D.", email: "j****@yahoo.com", message: "Can I get a certificate after completing the free tier?", time: "1 hour ago" },
    { name: "Lena W.", email: "l****@gmail.com", message: "Amazing platform! When will you add mobile app?", time: "3 hours ago" },
    { name: "Carlos R.", email: "c****@company.com", message: "We'd like to discuss enterprise pricing.", time: "5 hours ago" },
  ],
  rlsPolicies: [
    { table: "courses", count: 3, summary: "SELECT (public), INSERT (instructor/admin), UPDATE (owner/admin)" },
    { table: "enrollments", count: 4, summary: "SELECT (own rows), INSERT (authenticated), UPDATE (own), DELETE (own)" },
    { table: "reviews", count: 3, summary: "SELECT (public), INSERT (enrolled user), DELETE (owner/admin)" },
    { table: "wishlists", count: 4, summary: "SELECT (own), INSERT (authenticated), DELETE (own)" },
    { table: "profiles", count: 2, summary: "SELECT (public), UPDATE (own profile)" },
  ],
};

export default function AdminDashboard() {
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = (format: "json" | "csv") => {
    if (format === "json") {
      const blob = new Blob([JSON.stringify(mockData.recentMessages, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "messages.json"; a.click();
    } else {
      const BOM = "\uFEFF";
      const headers = "Name,Email,Message,Time";
      const rows = mockData.recentMessages.map(m =>
        `"${m.name}","${m.email}","${m.message.replace(/"/g, '""')}","${m.time}"`
      );
      const blob = new Blob([BOM + [headers, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "messages.csv"; a.click();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">Last updated: {lastUpdated}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600"><Users className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold font-serif">{mockData.roles.reduce((a, b) => a + b.count, 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-orange-100 text-primary"><MessageSquare className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Messages</p>
              <p className="text-2xl font-bold font-serif">{mockData.messages.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-green-100 text-green-600"><MessageSquare className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Messages (24h)</p>
              <p className="text-2xl font-bold font-serif">{mockData.messages.last24h}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Role Distribution */}
        <Card className="border-border">
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" /> Role Distribution</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {mockData.roles.map(({ role, count }) => {
              const total = mockData.roles.reduce((a, b) => a + b.count, 0);
              const pct = Math.round((count / total) * 100);
              return (
                <div key={role}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium">{role}</span>
                    <span className="text-muted-foreground">{count.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* RLS Policies */}
        <Card className="border-border">
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> RLS Policies</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {mockData.rlsPolicies.map(({ table, count, summary }) => (
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
              <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => handleExport("json")}>
                <Download className="h-3 w-3" /> JSON
              </Button>
              <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => handleExport("csv")}>
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
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Message</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {mockData.recentMessages.map((msg, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-medium">{msg.name}</td>
                    <td className="py-3 px-3 text-muted-foreground font-mono text-xs">{msg.email}</td>
                    <td className="py-3 px-3 text-muted-foreground max-w-xs truncate">{msg.message}</td>
                    <td className="py-3 px-3 text-muted-foreground text-xs whitespace-nowrap">{msg.time}</td>
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
