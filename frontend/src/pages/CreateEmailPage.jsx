import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  Send,
  Wand2,
  Save,
  ArrowLeft,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { EmailPreview } from "@/components/email/EmailPreview";
import { QualityScore } from "@/components/email/QualityScore";
import { SuggestionPanel } from "@/components/email/SuggestionPanel";
import { SubjectOptimizer } from "@/components/email/SubjectOptimizer";
import { EmailVariations } from "@/components/email/EmailVariations";
import { agentService } from "@/services/agentService";
import { cn } from "@/lib/utils";
const emailFormSchema = z.object({
  recipientEmail: z.string().email("Please enter a valid email"),
  recipientName: z.string().optional(),
  companyName: z.string().optional(),
  jobPosition: z.string().optional(),
  purpose: z.string().min(1, "Purpose is required"),
  userBackground: z.string().optional(),
  additionalNotes: z.string().optional(),
  tone: z.enum(["professional", "friendly", "startup", "formal"])
});
const steps = [
  { id: 1, title: "Recipient", icon: "\u{1F4E7}" },
  { id: 2, title: "Details", icon: "\u{1F4DD}" },
  { id: 3, title: "Preview", icon: "\u{1F441}\uFE0F" }
];
export default function CreateEmailPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [result, setResult] = useState(null);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [altSubjects, setAltSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [variations, setVariations] = useState(null);
  const [loadingVariations, setLoadingVariations] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    getValues
  } = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { tone: "professional" }
  });
  const tone = watch("tone");
  const handleGenerate = async (data) => {
    setGenerating(true);
    try {
      const response = await agentService.generateEmail(data);
      setResult(response);
      setEditedSubject(response.email.subject);
      setEditedContent(response.email.content);
      setCurrentStep(3);
      toast.success(`Email generated! Quality: ${response.qualityScore}/100`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate email");
    } finally {
      setGenerating(false);
    }
  };
  const handleSend = async () => {
    if (!result?.email._id) return;
    if (editedSubject !== result.email.subject || editedContent !== result.email.content) {
      try {
        await agentService.saveDraft({
          emailId: result.email._id,
          subject: editedSubject,
          content: editedContent
        });
      } catch (e) {
      }
    }
    setSending(true);
    try {
      await agentService.sendEmail(result.email._id);
      setSent(true);
      toast.success("Email sent successfully! \u{1F389}");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };
  const handleOptimizeSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const res = await agentService.optimizeSubject(
        editedSubject,
        editedContent,
        getValues("purpose")
      );
      setAltSubjects(res.subjects);
    } catch {
      toast.error("Failed to generate alternative subjects");
    } finally {
      setLoadingSubjects(false);
    }
  };
  const handleGenerateVariations = async () => {
    setLoadingVariations(true);
    try {
      const res = await agentService.getVariations(getValues());
      setVariations(res.variations);
    } catch {
      toast.error("Failed to generate variations");
    } finally {
      setLoadingVariations(false);
    }
  };
  if (sent) {
    return /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto text-center py-20 space-y-6 animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "h-10 w-10 text-emerald-500" })), /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold" }, "Email Sent! \u{1F389}"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Your cold email has been successfully delivered to", " ", /* @__PURE__ */ React.createElement("span", { className: "font-medium text-foreground" }, result?.email.recipientEmail)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-3" }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", onClick: () => navigate("/history") }, "View History"), /* @__PURE__ */ React.createElement(Button, { onClick: () => {
      setSent(false);
      setCurrentStep(1);
      setResult(null);
    } }, "Create Another")));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "max-w-5xl mx-auto space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-2" }, steps.map((step, i) => /* @__PURE__ */ React.createElement("div", { key: step.id, className: "flex items-center" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => step.id < currentStep && setCurrentStep(step.id),
      className: cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
        currentStep === step.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : currentStep > step.id ? "bg-primary/10 text-primary cursor-pointer" : "bg-muted text-muted-foreground"
      )
    },
    /* @__PURE__ */ React.createElement("span", null, step.icon),
    /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, step.title)
  ), i < steps.length - 1 && /* @__PURE__ */ React.createElement("div", { className: cn(
    "w-8 h-0.5 mx-2 transition-colors duration-300",
    currentStep > step.id ? "bg-primary" : "bg-muted"
  ) })))), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit(handleGenerate) }, currentStep === 1 && /* @__PURE__ */ React.createElement(Card, { className: "animate-fade-in" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, null, "Recipient Information")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid gap-4 md:grid-cols-2" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "create-recipient-email" }, "Recipient Email *"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "create-recipient-email",
      type: "email",
      placeholder: "recipient@company.com",
      ...register("recipientEmail"),
      className: errors.recipientEmail ? "border-destructive" : ""
    }
  ), errors.recipientEmail && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-destructive" }, errors.recipientEmail.message)), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "create-recipient-name" }, "Recipient Name"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "create-recipient-name",
      placeholder: "Jane Smith",
      ...register("recipientName")
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "grid gap-4 md:grid-cols-2" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "create-company" }, "Company Name"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "create-company",
      placeholder: "Google, Microsoft, etc.",
      ...register("companyName")
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "create-position" }, "Job Position"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "create-position",
      placeholder: "Software Engineer, Product Manager",
      ...register("jobPosition")
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end" }, /* @__PURE__ */ React.createElement(Button, { type: "button", onClick: () => setCurrentStep(2), className: "gap-2" }, "Next", /* @__PURE__ */ React.createElement(ArrowRight, { className: "h-4 w-4" }))))), currentStep === 2 && /* @__PURE__ */ React.createElement(Card, { className: "animate-fade-in" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, null, "Email Details")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "create-purpose" }, "Purpose *"), /* @__PURE__ */ React.createElement(
    Select,
    {
      value: watch("purpose"),
      onValueChange: (v) => setValue("purpose", v)
    },
    /* @__PURE__ */ React.createElement(SelectTrigger, { id: "create-purpose" }, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "What's the purpose of this email?" })),
    /* @__PURE__ */ React.createElement(SelectContent, null, /* @__PURE__ */ React.createElement(SelectItem, { value: "Internship request" }, "\u{1F393} Internship Request"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Job application" }, "\u{1F4BC} Job Application"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Freelance project proposal" }, "\u{1F680} Freelance Proposal"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Collaboration request" }, "\u{1F91D} Collaboration"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Networking and professional connection" }, "\u{1F310} Networking"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Business partnership" }, "\u{1F4C8} Business Partnership"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Sales outreach" }, "\u{1F4B0} Sales Outreach"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Other" }, "\u{1F4E7} Other"))
  ), errors.purpose && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-destructive" }, errors.purpose.message)), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "create-background" }, "Your Background"), /* @__PURE__ */ React.createElement(
    Textarea,
    {
      id: "create-background",
      placeholder: "Tell us about yourself \u2014 your skills, experience, projects, education...",
      ...register("userBackground"),
      className: "min-h-[100px]"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "create-notes" }, "Additional Notes"), /* @__PURE__ */ React.createElement(
    Textarea,
    {
      id: "create-notes",
      placeholder: "Any specific points to include, references, or special requests...",
      ...register("additionalNotes")
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, null, "Tone"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2" }, [
    { value: "professional", label: "\u{1F4BC} Professional", desc: "Polished & business-like" },
    { value: "friendly", label: "\u{1F60A} Friendly", desc: "Warm & approachable" },
    { value: "startup", label: "\u{1F680} Startup", desc: "Bold & energetic" },
    { value: "formal", label: "\u{1F3A9} Formal", desc: "Traditional & respectful" }
  ].map((t) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t.value,
      type: "button",
      onClick: () => setValue("tone", t.value),
      className: cn(
        "p-3 rounded-lg border text-left transition-all duration-200",
        tone === t.value ? "border-primary bg-primary/5 shadow-sm shadow-primary/10" : "border-border hover:border-primary/30"
      )
    },
    /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium" }, t.label),
    /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground mt-0.5" }, t.desc)
  )))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement(Button, { type: "button", variant: "outline", onClick: () => setCurrentStep(1), className: "gap-2" }, /* @__PURE__ */ React.createElement(ArrowLeft, { className: "h-4 w-4" }), "Back"), /* @__PURE__ */ React.createElement(Button, { type: "submit", disabled: generating, className: "gap-2" }, generating ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }), "AI is generating...") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Wand2, { className: "h-4 w-4" }), "Generate Email")))))), currentStep === 3 && result && /* @__PURE__ */ React.createElement("div", { className: "space-y-6 animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "grid gap-6 lg:grid-cols-3" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-2 space-y-4" }, /* @__PURE__ */ React.createElement(
    EmailPreview,
    {
      subject: editedSubject,
      content: editedContent,
      qualityScore: result.qualityScore,
      recipientEmail: result.email.recipientEmail,
      recipientName: result.email.recipientName,
      onSubjectChange: setEditedSubject,
      onContentChange: setEditedContent
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      onClick: () => setCurrentStep(2),
      className: "gap-2"
    },
    /* @__PURE__ */ React.createElement(ArrowLeft, { className: "h-4 w-4" }),
    "Edit Details"
  ), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      onClick: () => {
        agentService.saveDraft({
          emailId: result.email._id,
          subject: editedSubject,
          content: editedContent
        });
        toast.success("Draft saved");
      },
      className: "gap-2"
    },
    /* @__PURE__ */ React.createElement(Save, { className: "h-4 w-4" }),
    "Save Draft"
  ), /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: handleSend,
      disabled: sending,
      className: "gap-2 flex-1",
      size: "lg"
    },
    sending ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }), "Sending...") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Send, { className: "h-4 w-4" }), "Send Email")
  ))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, { className: "p-4 space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center" }, /* @__PURE__ */ React.createElement(QualityScore, { score: result.qualityScore, size: "lg" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, [
    { label: "Grammar", value: result.validationDetails.grammar },
    { label: "Readability", value: result.validationDetails.readability },
    { label: "Professionalism", value: result.validationDetails.professionalism },
    { label: "Spam Check", value: result.validationDetails.spamScore },
    { label: "Length", value: result.validationDetails.lengthScore }
  ].map((item) => /* @__PURE__ */ React.createElement("div", { key: item.label, className: "flex items-center justify-between text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "text-muted-foreground" }, item.label), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-20 h-1.5 bg-muted rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn(
        "h-full rounded-full transition-all duration-500",
        item.value >= 80 ? "bg-emerald-500" : item.value >= 60 ? "bg-amber-500" : "bg-red-500"
      ),
      style: { width: `${item.value}%` }
    }
  )), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-mono w-7 text-right" }, item.value))))))), /* @__PURE__ */ React.createElement(SuggestionPanel, { suggestions: result.suggestions }), /* @__PURE__ */ React.createElement(
    SubjectOptimizer,
    {
      subjects: altSubjects,
      loading: loadingSubjects,
      onOptimize: handleOptimizeSubjects,
      onSelect: (s) => {
        setEditedSubject(s);
        toast.success("Subject updated");
      }
    }
  ), /* @__PURE__ */ React.createElement(
    EmailVariations,
    {
      variations,
      loading: loadingVariations,
      onGenerate: handleGenerateVariations,
      onSelect: (v) => {
        setEditedSubject(v.subject);
        setEditedContent(v.content);
        toast.success("Version applied");
      }
    }
  )))));
}
