import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
export function StatCard({ title, value, icon: Icon, trend, trendUp, gradient, delay = 0 }) {
  return /* @__PURE__ */ React.createElement(
    Card,
    {
      className: "overflow-hidden opacity-0 animate-fade-in border-0",
      style: { animationDelay: `${delay}ms`, animationFillMode: "forwards" }
    },
    /* @__PURE__ */ React.createElement(CardContent, { className: "p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground font-medium" }, title), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold" }, value), trend && /* @__PURE__ */ React.createElement(
      "p",
      {
        className: cn(
          "text-xs font-medium",
          trendUp ? "text-emerald-500" : "text-amber-500"
        )
      },
      trend
    )), /* @__PURE__ */ React.createElement("div", { className: cn("h-12 w-12 rounded-xl flex items-center justify-center", gradient) }, /* @__PURE__ */ React.createElement(Icon, { className: "h-6 w-6 text-white" }))))
  );
}
