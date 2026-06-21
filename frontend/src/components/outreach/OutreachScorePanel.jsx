import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Gauge } from "lucide-react";
export const OutreachScorePanel = ({
  scores,
  loading = false
}) => {
  const getProgressColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };
  const getOverallScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
    if (score >= 60) return "text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
    return "text-red-500 border-red-500/20 bg-red-500/10";
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-zinc-950/60 backdrop-blur-md h-full" }, /* @__PURE__ */ React.createElement(CardContent, { className: "flex flex-col items-center justify-center h-[350px] space-y-3" }, /* @__PURE__ */ React.createElement(Gauge, { className: "h-8 w-8 text-primary animate-pulse" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400" }, "Analyzing email content quality...")));
  }
  if (!scores) return null;
  const scoreItems = [
    { label: "Spam Deliverability", value: scores.spamScore, tooltip: "How likely this email will bypass spam filters. (Higher is better)" },
    { label: "Professional Tone", value: scores.professionalismScore, tooltip: "Tone professionalism, grammar, and layout alignment." },
    { label: "Personalization Index", value: scores.personalizationScore, tooltip: "Level of custom references to company & job requirements." },
    { label: "Grammar & Clarity", value: scores.grammarScore, tooltip: "Grammar accuracy, spelling, and sentence structures." },
    { label: "Response Probability", value: scores.predictedResponseProbability, tooltip: "AI estimate of receiver response rate." }
  ];
  return /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-zinc-950/60 backdrop-blur-md" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-3 border-b border-zinc-900 flex flex-row items-center justify-between" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-base font-bold text-zinc-100 flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Gauge, { className: "h-4.5 w-4.5 text-primary" }), " AI Quality Assessment"), /* @__PURE__ */ React.createElement("div", { className: `px-2.5 py-1 rounded-full border text-xs font-bold ${getOverallScoreColor(scores.overallScore)}` }, "Overall: ", scores.overallScore, "/100")), /* @__PURE__ */ React.createElement(CardContent, { className: "pt-4 space-y-5 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, scoreItems.map((item, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ React.createElement("span", { className: "text-zinc-400 font-medium" }, item.label), /* @__PURE__ */ React.createElement("span", { className: "text-zinc-200 font-bold" }, item.value, "%")), /* @__PURE__ */ React.createElement(Progress, { value: item.value, className: "h-1.5 bg-zinc-900", indicatorClassName: getProgressColor(item.value) })))), scores.feedback.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "space-y-2 pt-3 border-t border-zinc-900" }, /* @__PURE__ */ React.createElement("h5", { className: "text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "h-3.5 w-3.5 text-emerald-500" }), " Strengths"), /* @__PURE__ */ React.createElement("ul", { className: "space-y-1 text-xs text-zinc-400" }, scores.feedback.map((fb, idx) => /* @__PURE__ */ React.createElement("li", { key: idx, className: "flex items-start gap-1.5 leading-relaxed" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-500 flex-shrink-0 mt-0.5" }, "\u2022"), /* @__PURE__ */ React.createElement("span", null, fb))))), scores.improvements.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "space-y-2 pt-2 border-t border-zinc-900/50" }, /* @__PURE__ */ React.createElement("h5", { className: "text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "h-3.5 w-3.5 text-yellow-500" }), " Suggested Edits"), /* @__PURE__ */ React.createElement("ul", { className: "space-y-1 text-xs text-zinc-400" }, scores.improvements.map((imp, idx) => /* @__PURE__ */ React.createElement("li", { key: idx, className: "flex items-start gap-1.5 leading-relaxed" }, /* @__PURE__ */ React.createElement("span", { className: "text-yellow-500 flex-shrink-0 mt-0.5" }, "\u2022"), /* @__PURE__ */ React.createElement("span", null, imp)))))));
};
