import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-background" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" }), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground text-sm" }, "Loading...")));
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ React.createElement(Navigate, { to: "/login", replace: true });
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
}
