import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { MapPin, DollarSign, Calendar, Briefcase, ChevronRight, FileText, CheckCircle, RefreshCw, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
export const JobCard = ({
  job,
  onFindContacts,
  onTrackJob,
  onDelete,
  isTracking = false
}) => {
  const [matchResult, setMatchResult] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const handleMatchResume = async () => {
    setLoadingMatch(true);
    setShowMatchModal(true);
    try {
      const match = await authService.matchResume(job._id);
      setMatchResult(match);
    } catch (error) {
      console.error("Match resume error:", error);
    } finally {
      setLoadingMatch(false);
    }
  };
  const getPlatformColor = (platform) => {
    switch (platform) {
      case "linkedin":
        return "bg-blue-600/10 text-blue-500 border-blue-500/20";
      case "naukri":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "internshala":
        return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      case "careers":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };
  const getMatchScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
    if (score >= 60) return "text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
    return "text-red-500 border-red-500/20 bg-red-500/10";
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, { className: "overflow-hidden border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getPlatformColor(job.platform)}` }, job.platform), /* @__PURE__ */ React.createElement(CardTitle, { className: "mt-2 text-xl font-bold text-zinc-100 line-clamp-1" }, job.title), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold text-zinc-400 mt-1" }, job.company)), onDelete && /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "ghost",
      size: "icon",
      className: "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50",
      onClick: () => onDelete(job._id)
    },
    /* @__PURE__ */ React.createElement(X, { className: "h-4 w-4" })
  ))), /* @__PURE__ */ React.createElement(CardContent, { className: "pb-3 text-sm text-zinc-300 space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-zinc-400" }, /* @__PURE__ */ React.createElement(MapPin, { className: "mr-1.5 h-3.5 w-3.5" }), /* @__PURE__ */ React.createElement("span", { className: "truncate" }, job.location)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-zinc-400" }, /* @__PURE__ */ React.createElement(Briefcase, { className: "mr-1.5 h-3.5 w-3.5" }), /* @__PURE__ */ React.createElement("span", { className: "capitalize" }, job.jobType)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-zinc-400" }, /* @__PURE__ */ React.createElement(DollarSign, { className: "mr-1.5 h-3.5 w-3.5" }), /* @__PURE__ */ React.createElement("span", null, job.salary || "Not disclosed")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-zinc-400" }, /* @__PURE__ */ React.createElement(Calendar, { className: "mr-1.5 h-3.5 w-3.5" }), /* @__PURE__ */ React.createElement("span", null, new Date(job.analyzedAt).toLocaleDateString()))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-zinc-500" }, "Required Skills"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1 mt-1.5" }, job.skills.slice(0, 5).map((skill, index) => /* @__PURE__ */ React.createElement(Badge, { key: index, variant: "secondary", className: "bg-zinc-800 text-zinc-300 border-none text-[10px]" }, skill)), job.skills.length > 5 && /* @__PURE__ */ React.createElement(Badge, { variant: "secondary", className: "bg-zinc-800/40 text-zinc-500 border-none text-[10px]" }, "+", job.skills.length - 5, " more")))), /* @__PURE__ */ React.createElement(CardFooter, { className: "pt-2 border-t border-zinc-900/50 bg-zinc-900/10 flex gap-2" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      className: "flex-1 border-zinc-800 hover:bg-zinc-900/50 hover:text-zinc-100",
      size: "sm",
      onClick: handleMatchResume
    },
    /* @__PURE__ */ React.createElement(FileText, { className: "mr-1.5 h-3.5 w-3.5" }),
    "Match AI"
  ), /* @__PURE__ */ React.createElement(
    Button,
    {
      className: "flex-1 bg-zinc-100 text-zinc-950 hover:bg-zinc-200",
      size: "sm",
      onClick: () => onFindContacts(job._id)
    },
    "Find Contacts",
    /* @__PURE__ */ React.createElement(ChevronRight, { className: "ml-1 h-3.5 w-3.5" })
  ), !isTracking && /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      size: "sm",
      className: "border-zinc-800 hover:bg-zinc-900 text-zinc-300",
      onClick: () => onTrackJob(job._id)
    },
    "Track"
  ))), /* @__PURE__ */ React.createElement(Dialog, { open: showMatchModal, onOpenChange: setShowMatchModal }, /* @__PURE__ */ React.createElement(DialogContent, { className: "max-w-2xl border border-zinc-800 bg-zinc-950 text-zinc-100" }, /* @__PURE__ */ React.createElement(DialogHeader, null, /* @__PURE__ */ React.createElement(DialogTitle, { className: "flex items-center justify-between text-xl font-bold" }, /* @__PURE__ */ React.createElement("span", null, "Resume Match Analysis"), matchResult && /* @__PURE__ */ React.createElement(Badge, { className: `text-sm ${getMatchScoreColor(matchResult.matchScore)}` }, matchResult.matchScore, "% Match")), /* @__PURE__ */ React.createElement(DialogDescription, { className: "text-zinc-500" }, "Comparing your profile against ", job.title, " at ", job.company)), loadingMatch ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center py-12 space-y-4" }, /* @__PURE__ */ React.createElement(RefreshCw, { className: "h-8 w-8 text-primary animate-spin" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400" }, "Comparing profile skills, experience, and projects...")) : matchResult ? /* @__PURE__ */ React.createElement("div", { className: "space-y-5 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/80" }, /* @__PURE__ */ React.createElement("p", { className: "text-zinc-300 italic leading-relaxed" }, '"', matchResult.summary, '"')), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-emerald-500 mb-2 flex items-center" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "mr-1.5 h-4 w-4" }), " Matching Skills"), matchResult.matchingSkills.length > 0 ? /* @__PURE__ */ React.createElement("ul", { className: "list-disc list-inside space-y-1 text-zinc-400 text-xs" }, matchResult.matchingSkills.map((s, i) => /* @__PURE__ */ React.createElement("li", { key: i }, s))) : /* @__PURE__ */ React.createElement("p", { className: "text-xs text-zinc-600" }, "No matching skills found.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-red-400 mb-2 flex items-center" }, /* @__PURE__ */ React.createElement(X, { className: "mr-1.5 h-4 w-4" }), " Gaps & Missing Skills"), matchResult.missingSkills.length > 0 ? /* @__PURE__ */ React.createElement("ul", { className: "list-disc list-inside space-y-1 text-zinc-400 text-xs" }, matchResult.missingSkills.map((s, i) => /* @__PURE__ */ React.createElement("li", { key: i }, s))) : /* @__PURE__ */ React.createElement("p", { className: "text-xs text-zinc-600" }, "No missing skills detected!"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-zinc-300 mb-1.5" }, "Actionable ATS Keywords"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1" }, matchResult.suggestedKeywords.map((kw, i) => /* @__PURE__ */ React.createElement(Badge, { key: i, variant: "outline", className: "border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px]" }, kw)))), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-zinc-300" }, "Recommended Improvements"), /* @__PURE__ */ React.createElement("ul", { className: "list-decimal list-inside space-y-1 text-zinc-400 text-xs mt-1" }, matchResult.recommendedImprovements.map((imp, i) => /* @__PURE__ */ React.createElement("li", { key: i }, imp)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-zinc-300" }, "Suggested Tailored Projects"), /* @__PURE__ */ React.createElement("ul", { className: "list-disc list-inside space-y-1 text-zinc-400 text-xs mt-1" }, matchResult.suggestedProjects.map((proj, i) => /* @__PURE__ */ React.createElement("li", { key: i }, proj)))))) : /* @__PURE__ */ React.createElement("div", { className: "py-8 text-center text-zinc-500" }, "Failed to run match. Please check if your profile is complete in Settings."))));
};
