import { Mail, Sparkles } from "lucide-react";

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 p-12 flex-col justify-between overflow-hidden">
        {/* Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-float delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MailCraft AI</span>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Craft Perfect
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-200">
                Application Emails
              </span>
              <br />
              with AI
            </h1>
            <p className="text-lg text-purple-200/80 max-w-md">
              Generate highly personalized job application emails using AI — just provide a job URL and your resume.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "🎯", text: "Smart job posting analysis" },
              { icon: "📄", text: "AI resume parsing & matching" },
              { icon: "✉️", text: "Personalized email generation" },
              { icon: "🎨", text: "One-click tone transformation" },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-purple-100/90"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-xl">{feature.icon}</span>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-purple-300/60 text-sm">
          <Sparkles className="h-4 w-4" />
          <span>Powered by AI Agents</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </div>
    </div>
  );
}
