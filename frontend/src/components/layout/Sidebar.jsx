import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PenSquare,
  History,
  FileText,
  Settings,
  Mail,
  LogOut,
  ChevronLeft,
  FileSearch,
  ArrowRightLeft,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileSearch, label: "Job Analyzer", path: "/jobs" },
  { icon: ArrowRightLeft, label: "Job Tracker", path: "/tracker" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: PenSquare, label: "Create Email", path: "/create" },
  { icon: History, label: "History", path: "/history" },
  { icon: FileText, label: "Templates", path: "/templates" },
  { icon: Settings, label: "Settings", path: "/settings" }
];
export function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  return /* @__PURE__ */ React.createElement(
    "aside",
    {
      className: cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-card/50 backdrop-blur-xl transition-all duration-300 flex flex-col",
        collapsed ? "w-[70px]" : "w-[260px]"
      )
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between p-4 h-16" }, /* @__PURE__ */ React.createElement(Link, { to: "/dashboard", className: "flex items-center gap-3 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" }, /* @__PURE__ */ React.createElement(Mail, { className: "h-5 w-5 text-primary" })), !collapsed && /* @__PURE__ */ React.createElement("span", { className: "font-bold text-lg whitespace-nowrap gradient-text" }, "ColdMail AI")), /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: "ghost",
        size: "icon",
        onClick: onToggle,
        className: cn("shrink-0", collapsed && "hidden")
      },
      /* @__PURE__ */ React.createElement(ChevronLeft, { className: "h-4 w-4" })
    )),
    /* @__PURE__ */ React.createElement(Separator, null),
    /* @__PURE__ */ React.createElement("nav", { className: "flex-1 p-3 space-y-1 overflow-y-auto" }, navItems.map((item) => {
      const isActive = location.pathname === item.path;
      return /* @__PURE__ */ React.createElement(
        Link,
        {
          key: item.path,
          to: item.path,
          className: cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
            isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )
        },
        /* @__PURE__ */ React.createElement(
          item.icon,
          {
            className: cn(
              "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
              isActive && "text-primary"
            )
          }
        ),
        !collapsed && /* @__PURE__ */ React.createElement("span", { className: "truncate" }, item.label)
      );
    })),
    /* @__PURE__ */ React.createElement(Separator, null),
    /* @__PURE__ */ React.createElement("div", { className: "p-3" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg",
          collapsed && "justify-center"
        )
      },
      /* @__PURE__ */ React.createElement(Avatar, { className: "h-8 w-8 shrink-0" }, /* @__PURE__ */ React.createElement(AvatarFallback, { className: "text-xs" }, user?.name?.charAt(0)?.toUpperCase() || "U")),
      !collapsed && /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium truncate" }, user?.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground truncate" }, user?.email)),
      !collapsed && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", onClick: logout, className: "shrink-0" }, /* @__PURE__ */ React.createElement(LogOut, { className: "h-4 w-4" }))
    ))
  );
}
