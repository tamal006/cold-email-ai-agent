import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, User, Calendar, Trash2, Globe } from "lucide-react";
const COLUMNS = [
  { key: "saved", label: "Saved", color: "border-t-zinc-600 bg-zinc-950/20" },
  { key: "outreach_sent", label: "Outreach Sent", color: "border-t-indigo-500 bg-indigo-950/5" },
  { key: "applied", label: "Applied", color: "border-t-blue-500 bg-blue-950/5" },
  { key: "interview_scheduled", label: "Interviews", color: "border-t-yellow-500 bg-yellow-950/5" },
  { key: "offer_received", label: "Offers", color: "border-t-emerald-500 bg-emerald-950/5" },
  { key: "rejected", label: "Rejected", color: "border-t-red-650 bg-red-950/5" }
];
export const TrackerBoard = ({
  entries,
  onStatusChange,
  onDelete
}) => {
  const getColumnEntries = (status) => {
    return entries.filter((e) => e.status === status);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4" }, COLUMNS.map((col) => {
    const colEntries = getColumnEntries(col.key);
    return /* @__PURE__ */ React.createElement("div", { key: col.key, className: "flex flex-col min-w-[240px] space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between px-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-zinc-350" }, col.label), /* @__PURE__ */ React.createElement(Badge, { variant: "secondary", className: "bg-zinc-800 text-zinc-300 font-bold text-xs px-2 py-0.5 border-none" }, colEntries.length)), /* @__PURE__ */ React.createElement("div", { className: `flex-1 min-h-[500px] border-t-2 rounded-lg border-zinc-900/60 p-2 space-y-3 ${col.color}` }, colEntries.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-48 border border-dashed border-zinc-900 rounded-lg" }, /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-zinc-650 text-center px-4" }, "No applications here.")) : colEntries.map((entry) => /* @__PURE__ */ React.createElement(Card, { key: entry._id, className: "border border-zinc-850 bg-zinc-950/80 hover:border-zinc-800 transition-all duration-200" }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-3.5 space-y-3.5 text-xs text-zinc-300" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-1.5" }, /* @__PURE__ */ React.createElement("h5", { className: "font-bold text-zinc-100 leading-tight line-clamp-1" }, entry.title), /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "h-6 w-6 text-zinc-600 hover:text-red-400 hover:bg-zinc-900/60 flex-shrink-0",
        onClick: () => onDelete(entry._id)
      },
      /* @__PURE__ */ React.createElement(Trash2, { className: "h-3 w-3" })
    )), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-zinc-400 font-semibold mt-0.5 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Building2, { className: "h-3 w-3 text-zinc-500" }), entry.company)), entry.contactId && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 text-zinc-400 bg-zinc-900/30 p-1.5 rounded border border-zinc-900" }, /* @__PURE__ */ React.createElement(User, { className: "h-3 w-3 text-zinc-500 flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "truncate leading-none" }, entry.contactId.fullName, " (", entry.contactId.role, ")")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-[10px] text-zinc-500" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Calendar, { className: "h-3 w-3" }), new Date(entry.createdAt).toLocaleDateString()), entry.sourceUrl && /* @__PURE__ */ React.createElement(
      "a",
      {
        href: entry.sourceUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-primary hover:underline flex items-center gap-0.5"
      },
      /* @__PURE__ */ React.createElement(Globe, { className: "h-3 w-3" }),
      " Job Link"
    )), entry.notes && /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-zinc-500 line-clamp-2 italic bg-zinc-900/10 p-1.5 rounded border border-zinc-900/50" }, '"', entry.notes, '"'), /* @__PURE__ */ React.createElement("div", { className: "pt-2 border-t border-zinc-900" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: entry.status,
        onValueChange: (val) => onStatusChange(entry._id, val)
      },
      /* @__PURE__ */ React.createElement(SelectTrigger, { className: "h-7 text-[10px] bg-zinc-950 border-zinc-800 text-zinc-400" }, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Update Status" })),
      /* @__PURE__ */ React.createElement(SelectContent, { className: "bg-zinc-950 border-zinc-800 text-zinc-100" }, /* @__PURE__ */ React.createElement(SelectItem, { className: "text-xs", value: "saved" }, "Saved"), /* @__PURE__ */ React.createElement(SelectItem, { className: "text-xs", value: "outreach_sent" }, "Outreach Sent"), /* @__PURE__ */ React.createElement(SelectItem, { className: "text-xs", value: "applied" }, "Applied"), /* @__PURE__ */ React.createElement(SelectItem, { className: "text-xs", value: "interview_scheduled" }, "Interviewing"), /* @__PURE__ */ React.createElement(SelectItem, { className: "text-xs", value: "offer_received" }, "Offer Received"), /* @__PURE__ */ React.createElement(SelectItem, { className: "text-xs", value: "rejected" }, "Rejected"))
    )))))));
  }));
};
