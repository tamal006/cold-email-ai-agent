import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateEmailPage from "@/pages/CreateEmailPage";
import EmailHistoryPage from "@/pages/EmailHistoryPage";
import EmailDetailPage from "@/pages/EmailDetailPage";
import TemplatesPage from "@/pages/TemplatesPage";
import SettingsPage from "@/pages/SettingsPage";
import { JobAnalyzerPage } from "@/pages/JobAnalyzerPage";
import { ContactDiscoveryPage } from "@/pages/ContactDiscoveryPage";
import { OutreachGeneratorPage } from "@/pages/OutreachGeneratorPage";
import { JobTrackerPage } from "@/pages/JobTrackerPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
function App() {
  return /* @__PURE__ */ React.createElement(AuthProvider, null, /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, { path: "/login", element: /* @__PURE__ */ React.createElement(LoginPage, null) }), /* @__PURE__ */ React.createElement(Route, { path: "/register", element: /* @__PURE__ */ React.createElement(RegisterPage, null) }), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/dashboard",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DashboardLayout, null, /* @__PURE__ */ React.createElement(DashboardPage, null)))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/jobs",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DashboardLayout, null, /* @__PURE__ */ React.createElement(JobAnalyzerPage, null)))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/contacts",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DashboardLayout, null, /* @__PURE__ */ React.createElement(ContactDiscoveryPage, null)))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/outreach",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DashboardLayout, null, /* @__PURE__ */ React.createElement(OutreachGeneratorPage, null)))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/tracker",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DashboardLayout, null, /* @__PURE__ */ React.createElement(JobTrackerPage, null)))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/analytics",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DashboardLayout, null, /* @__PURE__ */ React.createElement(AnalyticsPage, null)))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/create",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DashboardLayout, null, /* @__PURE__ */ React.createElement(CreateEmailPage, null)))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/history",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DashboardLayout, null, /* @__PURE__ */ React.createElement(EmailHistoryPage, null)))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/history/:id",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DashboardLayout, null, /* @__PURE__ */ React.createElement(EmailDetailPage, null)))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/templates",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DashboardLayout, null, /* @__PURE__ */ React.createElement(TemplatesPage, null)))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/settings",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(DashboardLayout, null, /* @__PURE__ */ React.createElement(SettingsPage, null)))
    }
  ), /* @__PURE__ */ React.createElement(Route, { path: "/", element: /* @__PURE__ */ React.createElement(Navigate, { to: "/dashboard", replace: true }) }), /* @__PURE__ */ React.createElement(Route, { path: "*", element: /* @__PURE__ */ React.createElement(Navigate, { to: "/dashboard", replace: true }) })));
}
export default App;
