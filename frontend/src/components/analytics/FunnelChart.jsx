import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList } from "recharts";
const COLORS = [
  "#71717a",
  // Saved/Tracked (zinc)
  "#6366f1",
  // Outreach Sent (indigo)
  "#3b82f6",
  // Applied (blue)
  "#eab308",
  // Interview (yellow)
  "#10b981"
  // Offer (emerald)
];
export const FunnelChart = ({ data }) => {
  const chartData = data ? [
    { name: "Saved/Tracked", count: data.tracked },
    { name: "Outreach Sent", count: data.outreach },
    { name: "Applied", count: data.applied },
    { name: "Interviews", count: data.interviews },
    { name: "Offers", count: data.offers }
  ] : [
    { name: "Saved/Tracked", count: 0 },
    { name: "Outreach Sent", count: 0 },
    { name: "Applied", count: 0 },
    { name: "Interviews", count: 0 },
    { name: "Offers", count: 0 }
  ];
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return /* @__PURE__ */ React.createElement("div", { className: "bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg shadow-xl text-xs" }, /* @__PURE__ */ React.createElement("p", { className: "font-bold text-zinc-150" }, payload[0].name), /* @__PURE__ */ React.createElement("p", { className: "text-zinc-400 mt-1" }, "Total: ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-zinc-200" }, payload[0].value)));
    }
    return null;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "w-full h-[300px]" }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(
    BarChart,
    {
      data: chartData,
      layout: "vertical",
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    },
    /* @__PURE__ */ React.createElement(XAxis, { type: "number", hide: true }),
    /* @__PURE__ */ React.createElement(
      YAxis,
      {
        dataKey: "name",
        type: "category",
        scale: "band",
        stroke: "#a1a1aa",
        fontSize: 11,
        tickLine: false,
        axisLine: false,
        width: 100
      }
    ),
    /* @__PURE__ */ React.createElement(Tooltip, { content: /* @__PURE__ */ React.createElement(CustomTooltip, null), cursor: { fill: "rgba(255,255,255,0.03)" } }),
    /* @__PURE__ */ React.createElement(Bar, { dataKey: "count", radius: [0, 4, 4, 0], barSize: 24 }, chartData.map((entry, index) => /* @__PURE__ */ React.createElement(Cell, { key: `cell-${index}`, fill: COLORS[index % COLORS.length] })), /* @__PURE__ */ React.createElement(LabelList, { dataKey: "count", position: "right", fill: "#e4e4e7", fontSize: 11, fontWeight: "bold" }))
  )));
};
