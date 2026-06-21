import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { QualityScore } from "@/components/email/QualityScore";
import { emailService } from "@/services/emailService";
import { agentService } from "@/services/agentService";
const statusColors = {
  sent: "success",
  draft: "warning",
  failed: "destructive"
};
export default function EmailDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  useEffect(() => {
    const fetchEmail = async () => {
      if (!id) return;
      try {
        const data = await emailService.getEmailById(id);
        setEmail(data.email);
      } catch {
        toast.error("Email not found");
        navigate("/history");
      } finally {
        setLoading(false);
      }
    };
    fetchEmail();
  }, [id, navigate]);
  const handleSend = async () => {
    if (!email?._id) return;
    setSending(true);
    try {
      await agentService.sendEmail(email._id);
      setEmail({ ...email, status: "sent", sentAt: (/* @__PURE__ */ new Date()).toISOString() });
      toast.success("Email sent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };
  const handleDelete = async () => {
    if (!email?._id) return;
    try {
      await emailService.deleteEmail(email._id);
      toast.success("Email deleted");
      navigate("/history");
    } catch {
      toast.error("Failed to delete email");
    }
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto space-y-4" }, /* @__PURE__ */ React.createElement(Skeleton, { className: "h-10 w-32" }), /* @__PURE__ */ React.createElement(Skeleton, { className: "h-[400px] rounded-xl" }));
  }
  if (!email) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto space-y-6 animate-fade-in" }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", onClick: () => navigate("/history"), className: "gap-2" }, /* @__PURE__ */ React.createElement(ArrowLeft, { className: "h-4 w-4" }), "Back to History"), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, { className: "border-b" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-xl" }, email.subject), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-sm text-muted-foreground" }, /* @__PURE__ */ React.createElement("span", null, "To: ", email.recipientName || email.recipientEmail), /* @__PURE__ */ React.createElement(Badge, { variant: statusColors[email.status] || "default" }, email.status))), email.qualityScore !== void 0 && /* @__PURE__ */ React.createElement(QualityScore, { score: email.qualityScore, size: "sm" }))), /* @__PURE__ */ React.createElement(CardContent, { className: "p-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid gap-3 md:grid-cols-2 mb-6" }, email.companyName && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Company"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium" }, email.companyName)), email.jobPosition && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Position"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium" }, email.jobPosition)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Tone"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium capitalize" }, email.tone)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Created"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium" }, format(new Date(email.createdAt), "MMM d, yyyy h:mm a"))), email.sentAt && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground" }, "Sent"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium" }, format(new Date(email.sentAt), "MMM d, yyyy h:mm a")))), /* @__PURE__ */ React.createElement(Separator, { className: "my-4" }), /* @__PURE__ */ React.createElement("div", { className: "prose prose-sm dark:prose-invert max-w-none" }, /* @__PURE__ */ React.createElement("p", { className: "whitespace-pre-wrap leading-relaxed" }, email.content)), /* @__PURE__ */ React.createElement(Separator, { className: "my-4" }), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement(Button, { variant: "destructive", size: "sm", onClick: handleDelete, className: "gap-2" }, /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" }), "Delete"), email.status === "draft" && /* @__PURE__ */ React.createElement(Button, { onClick: handleSend, disabled: sending, className: "gap-2" }, sending ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }), "Sending...") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Send, { className: "h-4 w-4" }), "Send Now"))))));
}
