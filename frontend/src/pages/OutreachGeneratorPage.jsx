import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { jobService } from "@/services/jobService";
import { contactService } from "@/services/contactService";
import { outreachService } from "@/services/outreachService";
import { OutreachPreview } from "@/components/outreach/OutreachPreview";
import { OutreachScorePanel } from "@/components/outreach/OutreachScorePanel";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft, Sparkles, Loader2, FileText, User } from "lucide-react";
import { toast } from "sonner";
export const OutreachGeneratorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId") || "";
  const contactId = searchParams.get("contactId") || "";
  const initialType = searchParams.get("type") || "job_application";
  const [job, setJob] = useState(null);
  const [contact, setContact] = useState(null);
  const [outreachType, setOutreachType] = useState(initialType);
  const [instructions, setInstructions] = useState("");
  const [generating, setGenerating] = useState(false);
  const [outreachData, setOutreachData] = useState(null);
  const [scores, setScores] = useState(null);
  const [emailId, setEmailId] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [scoring, setScoring] = useState(false);
  useEffect(() => {
    if (jobId) {
      fetchContext();
    } else {
      toast.error("No Job ID specified.");
      navigate("/jobs");
    }
  }, [jobId, contactId]);
  const fetchContext = async () => {
    try {
      const jobData = await jobService.getJobById(jobId);
      setJob(jobData);
      if (contactId) {
        const data = await contactService.getContactsForJob(jobId);
        const match = data.contacts.find((c) => c._id === contactId);
        if (match) setContact(match);
      }
    } catch (error) {
      console.error("Fetch context error:", error);
      toast.error("Failed to load job context.");
    }
  };
  const handleGenerate = async () => {
    setGenerating(true);
    setOutreachData(null);
    setScores(null);
    try {
      const res = await outreachService.generateOutreach({
        jobId,
        contactId: contactId || void 0,
        outreachType,
        additionalInstructions: instructions
      });
      setOutreachData(res.outreach);
      setScores(res.scores);
      setEmailId(res.emailId);
      setRecipientEmail(res.recipientEmail);
      toast.success("Outreach message generated successfully.");
    } catch (error) {
      console.error("Generate error:", error);
      toast.error(error.response?.data?.message || "Failed to generate outreach.");
    } finally {
      setGenerating(false);
    }
  };
  const handleScoreUpdate = async (subject, content) => {
    if (scoring) return;
    setScoring(true);
    try {
      const updatedScores = await outreachService.scoreOutreach({
        subject,
        content,
        outreachType,
        contactRole: contact?.role || "Hiring Team"
      });
      setScores(updatedScores);
    } catch (error) {
      console.error("Scoring error:", error);
    } finally {
      setScoring(false);
    }
  };
  const handleSend = async (id) => {
    try {
      await outreachService.sendOutreachEmail(id);
      toast.success("Outreach sent and logged in tracker!");
      navigate("/tracker");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send outreach email.");
      throw error;
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6 max-w-6xl mx-auto px-4 py-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between pb-4 border-b border-zinc-900" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-zinc-400 hover:text-zinc-200", onClick: () => navigate(`/contacts?jobId=${jobId}`) }, /* @__PURE__ */ React.createElement(ChevronLeft, { className: "h-5 w-5" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-black text-zinc-150 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "h-5.5 w-5.5 text-primary" }), " Outreach Generator"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-zinc-555" }, "AI-powered personalization for cold emails and referrals.")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-zinc-400 uppercase tracking-wider" }, "Configuration"), job && /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-900 bg-zinc-950/40" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-2 border-b border-zinc-900/60 p-3" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-xs font-bold text-zinc-400 flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(FileText, { className: "h-3.5 w-3.5" }), " Job Context")), /* @__PURE__ */ React.createElement(CardContent, { className: "p-3 text-xs space-y-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-zinc-200 leading-tight" }, job.title), /* @__PURE__ */ React.createElement("p", { className: "text-zinc-500" }, job.company)), contact && /* @__PURE__ */ React.createElement("div", { className: "pt-2 border-t border-zinc-900 flex items-center gap-1.5 text-zinc-400" }, /* @__PURE__ */ React.createElement(User, { className: "h-3.5 w-3.5 text-zinc-500" }), /* @__PURE__ */ React.createElement("span", null, contact.fullName, " (", contact.role, ")")))), /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-zinc-950/60" }, /* @__PURE__ */ React.createElement(CardContent, { className: "pt-4 space-y-4 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-bold uppercase tracking-wider text-zinc-500" }, "Outreach Type"), /* @__PURE__ */ React.createElement(Select, { value: outreachType, onValueChange: setOutreachType }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "bg-zinc-950 border-zinc-800 text-zinc-300" }, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Select type" })), /* @__PURE__ */ React.createElement(SelectContent, { className: "bg-zinc-950 border-zinc-800 text-zinc-100" }, /* @__PURE__ */ React.createElement(SelectItem, { className: "text-xs", value: "referral_request" }, "Referral Request"), /* @__PURE__ */ React.createElement(SelectItem, { className: "text-xs", value: "internship_request" }, "Internship Request"), /* @__PURE__ */ React.createElement(SelectItem, { className: "text-xs", value: "job_application" }, "Job Application"), /* @__PURE__ */ React.createElement(SelectItem, { className: "text-xs", value: "networking" }, "Networking Request"), /* @__PURE__ */ React.createElement(SelectItem, { className: "text-xs", value: "follow_up" }, "Follow-Up Message")))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-bold uppercase tracking-wider text-zinc-500" }, "User Context & Notes"), /* @__PURE__ */ React.createElement(
    Textarea,
    {
      placeholder: "E.g., I am a CSE student, built 3 full-stack React projects, won a hackathon, require remote work, etc.",
      value: instructions,
      onChange: (e) => setInstructions(e.target.value),
      className: "min-h-[140px] bg-zinc-950 border-zinc-800 text-zinc-300"
    }
  )), /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: handleGenerate,
      disabled: generating,
      className: "w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
    },
    generating ? /* @__PURE__ */ React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ React.createElement(Sparkles, { className: "mr-2 h-4 w-4" }),
    "Generate Message"
  )))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-2 space-y-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-zinc-400 uppercase tracking-wider" }, "Outreach Preview"), generating ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-[350px] border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-8 w-8 text-primary animate-spin mb-3" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400" }, "Personalizing opening, connecting experience, and generating drafts...")) : outreachData ? /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "md:col-span-2" }, /* @__PURE__ */ React.createElement(
    OutreachPreview,
    {
      outreach: outreachData,
      emailId,
      recipientEmail,
      onSend: handleSend,
      onScoreUpdate: handleScoreUpdate
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(OutreachScorePanel, { scores, loading: scoring }))) : /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-[350px] border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20 text-zinc-500" }, "Select type, add custom context, and click Generate above."))));
};
