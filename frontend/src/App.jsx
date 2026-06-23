import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import GenerateEmailPage from "@/pages/GenerateEmailPage";
import ResumeUploadPage from "@/pages/ResumeUploadPage";
import { JobAnalyzerPage } from "@/pages/JobAnalyzerPage";
import SavedDraftsPage from "@/pages/SavedDraftsPage";
import EmailHistoryPage from "@/pages/EmailHistoryPage";
import EmailDetailPage from "@/pages/EmailDetailPage";
import SettingsPage from "@/pages/SettingsPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Generate Email (Main Flow) */}
        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <GenerateEmailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Resume Manager */}
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ResumeUploadPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Job Analyzer */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <JobAnalyzerPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Saved Drafts */}
        <Route
          path="/drafts"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SavedDraftsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Email History */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EmailHistoryPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EmailDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
