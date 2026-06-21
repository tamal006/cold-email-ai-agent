import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
export function EmailVariations({ variations, loading, onGenerate, onSelect }) {
  if (!variations && !loading) {
    return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, { className: "p-6 text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground mb-4" }, "Generate your email in different tones to compare"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", onClick: onGenerate, disabled: loading }, "Generate Variations")));
  }
  if (loading) {
    return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, { className: "p-6 flex items-center justify-center gap-3" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-5 w-5 animate-spin text-primary" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-muted-foreground" }, "Generating variations...")));
  }
  if (!variations) return null;
  const tabs = [
    { key: "formal", label: "\u{1F3A9} Formal", data: variations.formal },
    { key: "friendly", label: "\u{1F60A} Friendly", data: variations.friendly },
    { key: "startup", label: "\u{1F680} Startup", data: variations.startup }
  ];
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, { className: "p-4" }, /* @__PURE__ */ React.createElement(Tabs, { defaultValue: "formal" }, /* @__PURE__ */ React.createElement(TabsList, { className: "w-full" }, tabs.map((tab) => /* @__PURE__ */ React.createElement(TabsTrigger, { key: tab.key, value: tab.key, className: "flex-1" }, tab.label))), tabs.map((tab) => /* @__PURE__ */ React.createElement(TabsContent, { key: tab.key, value: tab.key, className: "mt-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground mb-1" }, "Subject"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium" }, tab.data.subject)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground mb-1" }, "Body"), /* @__PURE__ */ React.createElement("p", { className: "text-sm whitespace-pre-wrap leading-relaxed" }, tab.data.content)), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      size: "sm",
      className: "w-full",
      onClick: () => onSelect(tab.data)
    },
    "Use This Version"
  )))))));
}
