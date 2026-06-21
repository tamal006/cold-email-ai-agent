import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
export function ActivityChart({ data }) {
  const formattedData = data.map((d) => ({
    ...d,
    label: format(new Date(d.date), "EEE")
  }));
  return /* @__PURE__ */ React.createElement(Card, { className: "opacity-0 animate-fade-in", style: { animationDelay: "500ms", animationFillMode: "forwards" } }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg" }, "Weekly Activity")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("div", { className: "h-[250px]" }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(AreaChart, { data: formattedData, margin: { top: 5, right: 5, left: -20, bottom: 0 } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "emailGradient", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "hsl(262, 83%, 58%)", stopOpacity: 0.4 }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "hsl(262, 83%, 58%)", stopOpacity: 0 }))), /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }), /* @__PURE__ */ React.createElement(
    XAxis,
    {
      dataKey: "label",
      stroke: "hsl(var(--muted-foreground))",
      fontSize: 12,
      tickLine: false,
      axisLine: false
    }
  ), /* @__PURE__ */ React.createElement(
    YAxis,
    {
      stroke: "hsl(var(--muted-foreground))",
      fontSize: 12,
      tickLine: false,
      axisLine: false,
      allowDecimals: false
    }
  ), /* @__PURE__ */ React.createElement(
    Tooltip,
    {
      contentStyle: {
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "8px",
        color: "hsl(var(--foreground))"
      }
    }
  ), /* @__PURE__ */ React.createElement(
    Area,
    {
      type: "monotone",
      dataKey: "count",
      stroke: "hsl(262, 83%, 58%)",
      strokeWidth: 2,
      fill: "url(#emailGradient)"
    }
  ))))));
}
