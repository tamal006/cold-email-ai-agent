import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Briefcase, FileText, Save, TrendingUp, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService } from "@/services/dashboardService";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentEmails, setRecentEmails] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } = await dashboardService.getStats();
      setStats(data.stats);
      setRecentEmails(data.recentEmails || []);
      setRecentJobs(data.recentJobs || []);
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Emails Generated",
      value: stats?.totalEmails || 0,
      icon: Mail,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Jobs Analyzed",
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Resumes",
      value: stats?.totalResumes || 0,
      icon: FileText,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Avg Match Score",
      value: `${stats?.avgMatchScore || 0}%`,
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0] || "User"}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's your email generation overview
          </p>
        </div>
        <Link to="/generate">
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Email
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((stat, i) => (
          <Card
            key={i}
            className="border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 hover:scale-[1.02]"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      {stats?.totalResumes === 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">Upload Your Resume First</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload a resume to start generating personalized application emails
                </p>
              </div>
              <Link to="/resume">
                <Button size="sm" className="gap-1.5">
                  Upload <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Emails */}
        <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                Recent Emails
              </h2>
              <Link to="/history" className="text-xs text-primary hover:underline">
                View all
              </Link>
            </div>
            {recentEmails.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No emails generated yet
              </p>
            ) : (
              <div className="space-y-2">
                {recentEmails.map((email) => (
                  <Link
                    key={email._id}
                    to={`/history/${email._id}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                        {email.jobTitle || email.subject}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {email.company}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[9px] shrink-0 ${
                        email.matchAnalysis?.matchScore >= 80
                          ? "text-emerald-400 border-emerald-500/30"
                          : "text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {email.matchAnalysis?.matchScore || 0}%
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-400" />
                Recent Jobs
              </h2>
              <Link to="/jobs" className="text-xs text-primary hover:underline">
                View all
              </Link>
            </div>
            {recentJobs.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No jobs analyzed yet
              </p>
            ) : (
              <div className="space-y-2">
                {recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{job.title}</p>
                      <p className="text-[10px] text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px] capitalize shrink-0">
                      {job.platform}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
