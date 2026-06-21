import React, { useState, useEffect } from "react";
import { trackerService } from "@/services/trackerService";
import { StatCard } from "@/components/analytics/StatCard";
import { FunnelChart } from "@/components/analytics/FunnelChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { BarChart3, Mail, TrendingUp, Award, Compass, CheckSquare, Loader2 } from "lucide-react";
export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchAnalytics();
  }, []);
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const analytics = await trackerService.getAnalytics();
      setData(analytics);
    } catch (error) {
      console.error("Fetch analytics error:", error);
      toast.error("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center min-h-[500px] space-y-4" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-10 w-10 text-primary animate-spin" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400" }, "Aggregating tracking metrics and email analytics..."));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-8 max-w-6xl mx-auto px-4 py-6" }, /* @__PURE__ */ React.createElement("div", { className: "pb-6 border-b border-zinc-900" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-black tracking-tight text-zinc-100 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(BarChart3, { className: "text-primary h-6 w-6" }), " Outreach Analytics"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400 mt-1" }, "Real-time statistics for application pipelines and AI cold outreach performance.")), data && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" }, /* @__PURE__ */ React.createElement(
    StatCard,
    {
      title: "Tracked Jobs",
      value: data.stats.totalTracked,
      icon: /* @__PURE__ */ React.createElement(Compass, { className: "h-5 w-5" }),
      description: "Total jobs added to your tracker"
    }
  ), /* @__PURE__ */ React.createElement(
    StatCard,
    {
      title: "Outreach Emails",
      value: data.stats.sentEmails,
      icon: /* @__PURE__ */ React.createElement(Mail, { className: "h-5 w-5" }),
      description: "Successfully delivered SMTP emails"
    }
  ), /* @__PURE__ */ React.createElement(
    StatCard,
    {
      title: "Response Rate",
      value: `${data.stats.responseRate}%`,
      icon: /* @__PURE__ */ React.createElement(TrendingUp, { className: "h-5 w-5" }),
      description: "Replies received / outreach sent ratio"
    }
  ), /* @__PURE__ */ React.createElement(
    StatCard,
    {
      title: "Referral Rate",
      value: `${data.stats.referralRate}%`,
      icon: /* @__PURE__ */ React.createElement(Award, { className: "h-5 w-5" }),
      description: "Referrals secured from connections"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement(Card, { className: "lg:col-span-2 border border-zinc-800 bg-zinc-950/60 backdrop-blur-md" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-3 border-b border-zinc-900" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm font-bold text-zinc-100 uppercase tracking-wider" }, "Application Funnel")), /* @__PURE__ */ React.createElement(CardContent, { className: "pt-6" }, /* @__PURE__ */ React.createElement(FunnelChart, { data: data.stats.funnel }))), /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-zinc-950/60 backdrop-blur-md" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-3 border-b border-zinc-900" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(CheckSquare, { className: "h-4.5 w-4.5" }), " Pipeline Status Distribution")), /* @__PURE__ */ React.createElement(CardContent, { className: "pt-4 divide-y divide-zinc-900" }, Object.entries(data.statusCounts).map(([status, count]) => {
    const capitalize = status.replace("_", " ").toUpperCase();
    return /* @__PURE__ */ React.createElement("div", { key: status, className: "flex items-center justify-between py-2 text-xs text-zinc-400" }, /* @__PURE__ */ React.createElement("span", null, capitalize), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-zinc-200" }, count));
  }))))));
};
