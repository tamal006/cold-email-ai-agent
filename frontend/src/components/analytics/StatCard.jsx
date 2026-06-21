import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export const StatCard = ({
  title,
  value,
  icon,
  description,
  trend
}) => {
  return /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-zinc-950/60 backdrop-blur-md relative overflow-hidden" }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-5 flex items-start justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-zinc-500" }, title), /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline space-x-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-3xl font-extrabold text-zinc-100" }, value), trend && /* @__PURE__ */ React.createElement("span", { className: `text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${trend.isPositive ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-red-500 bg-red-500/10 border-red-500/20"}` }, trend.isPositive ? "+" : "", trend.value, "%")), description && /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-zinc-500" }, description)), /* @__PURE__ */ React.createElement("div", { className: "p-2.5 bg-zinc-900 border border-zinc-800/80 text-primary rounded-xl flex items-center justify-center" }, icon)));
};
