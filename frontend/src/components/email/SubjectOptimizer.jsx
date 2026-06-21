import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
export function SubjectOptimizer({ subjects, loading, onOptimize, onSelect }) {
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "h-4 w-4 text-primary" }), "Subject Line Optimizer"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", onClick: onOptimize, disabled: loading }, loading ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-3 w-3 animate-spin" }) : "Generate"))), /* @__PURE__ */ React.createElement(CardContent, null, subjects.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, "Click Generate to get 5 alternative subject lines optimized for open rates.") : /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, subjects.map((subject, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: i,
      onClick: () => onSelect(subject),
      className: "w-full text-left p-2.5 rounded-lg text-sm hover:bg-accent transition-colors duration-200 border border-transparent hover:border-primary/20"
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-muted-foreground mr-2 font-mono text-xs" }, i + 1, "."),
    subject
  )))));
}
