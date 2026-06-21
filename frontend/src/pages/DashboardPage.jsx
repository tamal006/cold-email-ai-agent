import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, TrendingUp, Calendar, PenSquare, FileSearch, ArrowRightLeft, Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RecentEmails } from "@/components/dashboard/RecentEmails";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { useEmails, useEmailStats } from "@/hooks/useEmails";
import { trackerService } from "@/services/trackerService";
import { Skeleton } from "@/components/ui/skeleton";
export default function DashboardPage() {
  const navigate = useNavigate();
  const { stats, activity, loading: statsLoading, fetchStats } = useEmailStats();
  const { emails, loading: emailsLoading, fetchEmails } = useEmails();
  const [trackedCount, setTrackedCount] = useState(0);
  const [interviewsCount, setInterviewsCount] = useState(0);
  useEffect(() => {
    fetchStats();
    fetchEmails({ limit: 5 });
    fetchTrackerSummary();
  }, [fetchStats, fetchEmails]);
  const fetchTrackerSummary = async () => {
    try {
      const data = await trackerService.getAnalytics();
      setTrackedCount(data.stats.totalTracked);
      setInterviewsCount(data.statusCounts.interview_scheduled || 0);
    } catch (error) {
      console.error("Fetch tracker summary error:", error);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-8 max-w-6xl mx-auto px-4 py-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-zinc-900 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-black tracking-tight text-zinc-100 flex items-center gap-2" }, "Welcome back \u{1F44B}"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400 mt-1" }, "Here is the status of your job outreach campaigns and application pipeline.")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: () => navigate("/jobs"),
      className: "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
    },
    /* @__PURE__ */ React.createElement(FileSearch, { className: "mr-2 h-4 w-4" }),
    " Analyze Job URL"
  ), /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: () => navigate("/create"),
      variant: "outline",
      className: "border-zinc-800 text-zinc-300 hover:bg-zinc-900"
    },
    /* @__PURE__ */ React.createElement(PenSquare, { className: "mr-2 h-4 w-4" }),
    " New Email"
  ))), /* @__PURE__ */ React.createElement("div", { className: "grid gap-4 grid-cols-2 lg:grid-cols-4" }, /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-gradient-to-br from-indigo-950/10 via-zinc-950 to-zinc-950/50" }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-5 flex items-start justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500" }, "Applications"), /* @__PURE__ */ React.createElement("h3", { className: "text-3xl font-extrabold text-zinc-100" }, trackedCount), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-zinc-500" }, "Tracked in pipeline")), /* @__PURE__ */ React.createElement("div", { className: "p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl" }, /* @__PURE__ */ React.createElement(Compass, { className: "h-5 w-5" })))), /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-gradient-to-br from-purple-950/10 via-zinc-950 to-zinc-950/50" }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-5 flex items-start justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500" }, "Outreach Emails"), /* @__PURE__ */ React.createElement("h3", { className: "text-3xl font-extrabold text-zinc-100" }, stats?.totalSent ?? 0), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-zinc-500" }, "Successfully sent")), /* @__PURE__ */ React.createElement("div", { className: "p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl" }, /* @__PURE__ */ React.createElement(Send, { className: "h-5 w-5" })))), /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-gradient-to-br from-emerald-950/10 via-zinc-950 to-zinc-950/50" }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-5 flex items-start justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500" }, "Success Rate"), /* @__PURE__ */ React.createElement("h3", { className: "text-3xl font-extrabold text-zinc-100" }, stats?.successRate ?? 100, "%"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-zinc-500" }, "Email delivery")), /* @__PURE__ */ React.createElement("div", { className: "p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl" }, /* @__PURE__ */ React.createElement(TrendingUp, { className: "h-5 w-5" })))), /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-gradient-to-br from-yellow-950/10 via-zinc-950 to-zinc-950/50" }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-5 flex items-start justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500" }, "Scheduled Interviews"), /* @__PURE__ */ React.createElement("h3", { className: "text-3xl font-extrabold text-zinc-100" }, interviewsCount), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-zinc-500" }, "Interviews pending")), /* @__PURE__ */ React.createElement("div", { className: "p-2.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl" }, /* @__PURE__ */ React.createElement(Calendar, { className: "h-5 w-5" }))))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-zinc-400 uppercase tracking-wider" }, "Quick Actions"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement(
    Card,
    {
      className: "border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/10 transition-all duration-300 cursor-pointer group",
      onClick: () => navigate("/jobs")
    },
    /* @__PURE__ */ React.createElement(CardContent, { className: "p-5 space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform" }, /* @__PURE__ */ React.createElement(FileSearch, { className: "h-5 w-5" })), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-zinc-200" }, "Analyze Job Posting"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-zinc-500 leading-relaxed" }, "Paste public URLs from LinkedIn, Naukri, or careers pages to pull requirements and match resume."))
  ), /* @__PURE__ */ React.createElement(
    Card,
    {
      className: "border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/10 transition-all duration-300 cursor-pointer group",
      onClick: () => navigate("/tracker")
    },
    /* @__PURE__ */ React.createElement(CardContent, { className: "p-5 space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform" }, /* @__PURE__ */ React.createElement(ArrowRightLeft, { className: "h-5 w-5" })), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-zinc-200" }, "Job Pipeline Board"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-zinc-500 leading-relaxed" }, "Track application progress, update statuses (Saved \u2192 Outreach \u2192 Interview \u2192 Offers), and manage schedules."))
  ), /* @__PURE__ */ React.createElement(
    Card,
    {
      className: "border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/10 transition-all duration-300 cursor-pointer group",
      onClick: () => navigate("/analytics")
    },
    /* @__PURE__ */ React.createElement(CardContent, { className: "p-5 space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "h-5 w-5" })), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-zinc-200" }, "Outreach Analytics"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-zinc-500 leading-relaxed" }, "Check email delivery health, conversion funnels, response probabilities, and referral success rate metrics."))
  ))), /* @__PURE__ */ React.createElement("div", { className: "grid gap-6 lg:grid-cols-2" }, /* @__PURE__ */ React.createElement(ActivityChart, { data: activity }), emailsLoading ? /* @__PURE__ */ React.createElement(Skeleton, { className: "h-[350px] rounded-xl" }) : /* @__PURE__ */ React.createElement(RecentEmails, { emails })));
}
