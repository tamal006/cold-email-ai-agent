import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Mail, ExternalLink, Send, MessageSquare } from "lucide-react";
export const ContactCard = ({
  contact,
  onSaveToggle,
  onGenerateOutreach
}) => {
  const getRelevanceColor = (score) => {
    if (score >= 80) return "text-primary border-primary/20 bg-primary/10";
    if (score >= 50) return "text-zinc-300 border-zinc-700 bg-zinc-900/50";
    return "text-zinc-500 border-zinc-800 bg-zinc-950";
  };
  const getEmailDisplay = () => {
    if (contact.emailStatus === "available" && contact.email) {
      return /* @__PURE__ */ React.createElement("span", { className: "text-zinc-300 select-all font-mono text-xs" }, contact.email);
    }
    return /* @__PURE__ */ React.createElement("span", { className: "text-zinc-500 italic text-xs" }, "Email not publicly available");
  };
  return /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-850 bg-zinc-950/40 backdrop-blur-sm hover:border-zinc-800 transition-all duration-200" }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-4 space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-zinc-100" }, contact.fullName), contact.isSuggested && /* @__PURE__ */ React.createElement(Badge, { variant: "outline", className: "text-[10px] px-1 py-0 border-zinc-800 bg-zinc-900 text-zinc-400" }, "Suggested Type")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-zinc-400 mt-0.5" }, contact.role), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-1" }, contact.department || "Hiring Department")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-end gap-1.5" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "ghost",
      size: "icon",
      className: `h-7 w-7 rounded-full ${contact.saved ? "text-yellow-500 hover:text-yellow-600" : "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900"}`,
      onClick: () => onSaveToggle(contact._id)
    },
    /* @__PURE__ */ React.createElement(Star, { className: "h-4 w-4", fill: contact.saved ? "currentColor" : "none" })
  ), /* @__PURE__ */ React.createElement(Badge, { className: `text-[10px] font-bold ${getRelevanceColor(contact.relevanceScore)}` }, "Relevance: ", contact.relevanceScore, "%"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 pt-1 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-zinc-400" }, /* @__PURE__ */ React.createElement(Mail, { className: "h-3.5 w-3.5 text-zinc-500 flex-shrink-0" }), getEmailDisplay()), contact.profileUrl && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-zinc-400" }, /* @__PURE__ */ React.createElement(ExternalLink, { className: "h-3.5 w-3.5 text-zinc-500 flex-shrink-0" }), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: contact.profileUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "text-primary hover:underline flex items-center gap-0.5 truncate max-w-[200px]"
    },
    "View Public Profile"
  ))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 pt-2 border-t border-zinc-900/50" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      size: "sm",
      variant: "outline",
      className: "flex-1 text-[11px] border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100",
      onClick: () => onGenerateOutreach(contact, "referral_request")
    },
    /* @__PURE__ */ React.createElement(MessageSquare, { className: "mr-1 h-3 w-3" }),
    "Referral Request"
  ), /* @__PURE__ */ React.createElement(
    Button,
    {
      size: "sm",
      className: "flex-1 text-[11px] bg-zinc-100 text-zinc-950 hover:bg-zinc-200",
      onClick: () => onGenerateOutreach(contact, "job_application")
    },
    /* @__PURE__ */ React.createElement(Send, { className: "mr-1 h-3 w-3" }),
    "Cold Outreach"
  ))));
};
