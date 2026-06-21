import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { emailService } from "@/services/emailService";
export default function TemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await emailService.getTemplates();
        setTemplates(data.templates);
      } catch {
        setTemplates([
          {
            id: "internship",
            name: "Internship Request",
            description: "Request an internship opportunity at a company.",
            icon: "\u{1F393}",
            category: "Career",
            defaults: { purpose: "Internship request", tone: "professional", additionalNotes: "Currently pursuing a degree." }
          },
          {
            id: "job",
            name: "Job Application",
            description: "Apply for a specific job position.",
            icon: "\u{1F4BC}",
            category: "Career",
            defaults: { purpose: "Job application", tone: "formal", additionalNotes: "Highlight relevant experience." }
          },
          {
            id: "freelance",
            name: "Freelance Proposal",
            description: "Propose your freelance services.",
            icon: "\u{1F680}",
            category: "Business",
            defaults: { purpose: "Freelance project proposal", tone: "startup", additionalNotes: "Focus on deliverables." }
          },
          {
            id: "collab",
            name: "Collaboration Request",
            description: "Propose a collaboration opportunity.",
            icon: "\u{1F91D}",
            category: "Networking",
            defaults: { purpose: "Collaboration request", tone: "friendly", additionalNotes: "Emphasize mutual benefits." }
          },
          {
            id: "network",
            name: "Networking",
            description: "Connect with industry professionals.",
            icon: "\u{1F310}",
            category: "Networking",
            defaults: { purpose: "Networking and professional connection", tone: "friendly", additionalNotes: "Keep it casual." }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);
  const handleSelect = (template) => {
    sessionStorage.setItem("emailTemplate", JSON.stringify(template.defaults));
    navigate("/create");
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" }, [...Array(5)].map((_, i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, className: "h-48 rounded-xl" })));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "animate-fade-in" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold" }, "Email Templates"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Choose a template to pre-fill your email form")), /* @__PURE__ */ React.createElement("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" }, templates.map((template, i) => /* @__PURE__ */ React.createElement(
    Card,
    {
      key: template.id,
      className: "cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-in group",
      style: { animationDelay: `${i * 100}ms`, animationFillMode: "forwards" },
      onClick: () => handleSelect(template)
    },
    /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-3xl group-hover:scale-110 transition-transform duration-300" }, template.icon), /* @__PURE__ */ React.createElement(Badge, { variant: "outline" }, template.category)), /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg mt-3 group-hover:text-primary transition-colors" }, template.name), /* @__PURE__ */ React.createElement(CardDescription, null, template.description)),
    /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-xs text-muted-foreground" }, /* @__PURE__ */ React.createElement("span", { className: "capitalize" }, "Tone: ", template.defaults.tone)))
  ))));
}
