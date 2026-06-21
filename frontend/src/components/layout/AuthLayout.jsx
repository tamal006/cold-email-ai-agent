import { Mail, Sparkles } from "lucide-react";
export function AuthLayout({ children }) {
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex" }, /* @__PURE__ */ React.createElement("div", { className: "hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 p-12 flex-col justify-between overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" }), /* @__PURE__ */ React.createElement("div", { className: "absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-float delay-500" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" })), /* @__PURE__ */ React.createElement("div", { className: "relative z-10" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement("div", { className: "h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Mail, { className: "h-5 w-5 text-white" })), /* @__PURE__ */ React.createElement("span", { className: "text-2xl font-bold text-white" }, "ColdMail AI"))), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 space-y-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-4xl font-bold text-white leading-tight mb-4" }, "Craft Perfect", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-200" }, "Cold Emails"), /* @__PURE__ */ React.createElement("br", null), "with AI"), /* @__PURE__ */ React.createElement("p", { className: "text-lg text-purple-200/80 max-w-md" }, "Let our AI agent generate, validate, and send professional cold emails that actually get responses.")), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, [
    { icon: "\u{1F916}", text: "AI-powered email generation" },
    { icon: "\u2705", text: "Quality validation & scoring" },
    { icon: "\u{1F4E7}", text: "One-click email sending" },
    { icon: "\u{1F4CA}", text: "Track & analyze performance" }
  ].map((feature, i) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: i,
      className: "flex items-center gap-3 text-purple-100/90",
      style: { animationDelay: `${i * 100}ms` }
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-xl" }, feature.icon),
    /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium" }, feature.text)
  )))), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 flex items-center gap-2 text-purple-300/60 text-sm" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, "Powered by OpenAI GPT-4o"))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex items-center justify-center p-8 bg-background" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md animate-fade-in" }, children)));
}
