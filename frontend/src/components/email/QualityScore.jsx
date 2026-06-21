export function QualityScore({ score, size = "md" }) {
  const getColor = () => {
    if (score >= 80) return { stroke: "#10b981", text: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (score >= 60) return { stroke: "#f59e0b", text: "text-amber-500", bg: "bg-amber-500/10" };
    return { stroke: "#ef4444", text: "text-red-500", bg: "bg-red-500/10" };
  };
  const sizes = {
    sm: { container: "h-16 w-16", text: "text-lg", label: "text-[8px]" },
    md: { container: "h-24 w-24", text: "text-2xl", label: "text-[10px]" },
    lg: { container: "h-32 w-32", text: "text-3xl", label: "text-xs" }
  };
  const color = getColor();
  const s = sizes[size];
  const circumference = 2 * Math.PI * 40;
  const progress = (100 - score) / 100 * circumference;
  return /* @__PURE__ */ React.createElement("div", { className: `relative ${s.container} flex items-center justify-center` }, /* @__PURE__ */ React.createElement("svg", { className: "absolute inset-0 -rotate-90", viewBox: "0 0 100 100" }, /* @__PURE__ */ React.createElement(
    "circle",
    {
      cx: "50",
      cy: "50",
      r: "40",
      fill: "none",
      stroke: "hsl(var(--border))",
      strokeWidth: "6"
    }
  ), /* @__PURE__ */ React.createElement(
    "circle",
    {
      cx: "50",
      cy: "50",
      r: "40",
      fill: "none",
      stroke: color.stroke,
      strokeWidth: "6",
      strokeDasharray: circumference,
      strokeDashoffset: progress,
      strokeLinecap: "round",
      className: "transition-all duration-1000 ease-out"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("span", { className: `${s.text} font-bold ${color.text}` }, score), /* @__PURE__ */ React.createElement("p", { className: `${s.label} text-muted-foreground uppercase tracking-wider` }, "Score")));
}
