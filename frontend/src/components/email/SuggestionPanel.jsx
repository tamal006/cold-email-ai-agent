import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function SuggestionPanel({ suggestions }) {
  if (!suggestions.length) return null;
  return /* @__PURE__ */ React.createElement(Card, { className: "border-amber-500/20" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-3" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-sm flex items-center gap-2 text-amber-500" }, /* @__PURE__ */ React.createElement(Lightbulb, { className: "h-4 w-4" }), "AI Suggestions")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("ul", { className: "space-y-2" }, suggestions.map((s, i) => /* @__PURE__ */ React.createElement("li", { key: i, className: "text-sm text-muted-foreground flex items-start gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-500 mt-0.5 shrink-0" }, "\u2022"), /* @__PURE__ */ React.createElement("span", null, s))))));
}
