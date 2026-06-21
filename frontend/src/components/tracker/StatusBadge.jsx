import React from "react";
export const StatusBadge = ({ status }) => {
  const getStatusDetails = (status2) => {
    switch (status2) {
      case "saved":
        return { label: "Saved", style: "bg-zinc-800 text-zinc-300 border-zinc-700/50" };
      case "outreach_sent":
        return { label: "Outreach Sent", style: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
      case "applied":
        return { label: "Applied", style: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "interview_scheduled":
        return { label: "Interviewing", style: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 font-bold" };
      case "rejected":
        return { label: "Rejected", style: "bg-red-500/10 text-red-400 border-red-500/20" };
      case "offer_received":
        return { label: "Offer Received", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold border-2" };
      default:
        return { label: "Unknown", style: "bg-zinc-900 text-zinc-400" };
    }
  };
  const details = getStatusDetails(status);
  return /* @__PURE__ */ React.createElement("span", { className: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${details.style}` }, details.label);
};
