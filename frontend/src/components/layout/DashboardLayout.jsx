import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
const pageTitles = {
  "/dashboard": "Dashboard",
  "/create": "Create Email",
  "/history": "Email History",
  "/templates": "Templates",
  "/settings": "Settings",
  "/jobs": "Job Analyzer",
  "/contacts": "Contact Discovery",
  "/outreach": "Outreach Generator",
  "/tracker": "Job Tracker",
  "/analytics": "Analytics"
};
export function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);
  const title = pageTitles[location.pathname] || "ColdMail AI";
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background" }, mobileOpen && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "fixed inset-0 z-30 bg-black/50 lg:hidden",
      onClick: () => setMobileOpen(false)
    }
  ), /* @__PURE__ */ React.createElement("div", { className: cn("hidden lg:block") }, /* @__PURE__ */ React.createElement(Sidebar, { collapsed, onToggle: () => setCollapsed(!collapsed) })), /* @__PURE__ */ React.createElement("div", { className: cn("lg:hidden", mobileOpen ? "block" : "hidden") }, /* @__PURE__ */ React.createElement(Sidebar, { collapsed: false, onToggle: () => setMobileOpen(false) })), /* @__PURE__ */ React.createElement(
    "main",
    {
      className: cn(
        "transition-all duration-300",
        collapsed ? "lg:ml-[70px]" : "lg:ml-[260px]"
      )
    },
    /* @__PURE__ */ React.createElement(
      Header,
      {
        title,
        onMenuClick: () => setMobileOpen(!mobileOpen),
        darkMode,
        onToggleDarkMode: () => setDarkMode(!darkMode)
      }
    ),
    /* @__PURE__ */ React.createElement("div", { className: "p-6" }, children)
  ));
}
