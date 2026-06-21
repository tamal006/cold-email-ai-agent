import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Copy, Send, Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
export const OutreachPreview = ({
  outreach,
  emailId,
  recipientEmail,
  onSend,
  onSaveDraft,
  onScoreUpdate
}) => {
  const [activeTab, setActiveTab] = useState("email");
  const [editedSubject, setEditedSubject] = useState(outreach.subjectLine);
  const [editedEmail, setEditedEmail] = useState(outreach.coldEmail);
  const [editedReferral, setEditedReferral] = useState(outreach.referralRequestEmail);
  const [editedLinkedin, setEditedLinkedin] = useState(outreach.linkedinMessage);
  const [editedLinkedinFollowUp, setEditedLinkedinFollowUp] = useState(outreach.linkedinFollowUp);
  const [editedShort, setEditedShort] = useState(outreach.shortNetworkingMessage);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setEditedSubject(outreach.subjectLine);
    setEditedEmail(outreach.coldEmail);
    setEditedReferral(outreach.referralRequestEmail);
    setEditedLinkedin(outreach.linkedinMessage);
    setEditedLinkedinFollowUp(outreach.linkedinFollowUp);
    setEditedShort(outreach.shortNetworkingMessage);
  }, [outreach]);
  const getCurrentText = () => {
    switch (activeTab) {
      case "email":
        return editedEmail;
      case "referral":
        return editedReferral;
      case "linkedin":
        return editedLinkedin;
      case "linkedin_followup":
        return editedLinkedinFollowUp;
      case "short":
        return editedShort;
      default:
        return "";
    }
  };
  const handleTextChange = (val) => {
    switch (activeTab) {
      case "email":
        setEditedEmail(val);
        onScoreUpdate(editedSubject, val);
        break;
      case "referral":
        setEditedReferral(val);
        onScoreUpdate(editedSubject, val);
        break;
      case "linkedin":
        setEditedLinkedin(val);
        break;
      case "linkedin_followup":
        setEditedLinkedinFollowUp(val);
        break;
      case "short":
        setEditedShort(val);
        break;
    }
  };
  const handleCopy = () => {
    const textToCopy = activeTab === "email" || activeTab === "referral" ? `Subject: ${editedSubject}

${getCurrentText()}` : getCurrentText();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2e3);
  };
  const handleSaveDraft = async () => {
    if (!onSaveDraft) return;
    setSaving(true);
    try {
      const content = activeTab === "referral" ? editedReferral : editedEmail;
      await onSaveDraft(emailId, editedSubject, content);
      toast.success("Draft saved successfully.");
    } catch (error) {
      toast.error("Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };
  const handleSendEmail = async () => {
    setSending(true);
    try {
      await onSend(emailId);
      toast.success("Outreach email sent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send outreach email.");
    } finally {
      setSending(false);
    }
  };
  return /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-zinc-950/70 backdrop-blur-md" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "pb-3 border-b border-zinc-900 flex flex-row items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-base font-bold text-zinc-100 flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "h-4.5 w-4.5 text-primary" }), " Generated Outreach Messages"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-zinc-500 mt-0.5" }, "Target: ", recipientEmail)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ShadcnButton, { size: "sm", variant: "ghost", className: "text-zinc-400 hover:text-zinc-200", onClick: handleCopy }, copied ? /* @__PURE__ */ React.createElement(Check, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ React.createElement(Copy, { className: "h-4 w-4" })), onSaveDraft && (activeTab === "email" || activeTab === "referral") && /* @__PURE__ */ React.createElement(ShadcnButton, { size: "sm", variant: "outline", className: "border-zinc-800 text-zinc-400 hover:text-zinc-200", onClick: handleSaveDraft, disabled: saving }, saving ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : "Save Draft"), (activeTab === "email" || activeTab === "referral") && /* @__PURE__ */ React.createElement(ShadcnButton, { size: "sm", className: "bg-zinc-100 text-zinc-950 hover:bg-zinc-200", onClick: handleSendEmail, disabled: sending }, sending ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Send, { className: "mr-1.5 h-3.5 w-3.5" }), " Send Outreach")))), /* @__PURE__ */ React.createElement(CardContent, { className: "pt-4" }, /* @__PURE__ */ React.createElement(Tabs, { value: activeTab, onValueChange: (val) => {
    setActiveTab(val);
    const content = val === "referral" ? editedReferral : editedEmail;
    onScoreUpdate(editedSubject, content);
  }, className: "w-full" }, /* @__PURE__ */ React.createElement(TabsList, { className: "grid w-full grid-cols-5 bg-zinc-900 text-zinc-400 h-9 p-1 mb-4 rounded-lg" }, /* @__PURE__ */ React.createElement(TabsTrigger, { value: "email", className: "text-xs rounded-md py-1.5 data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-100" }, "Cold Email"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "referral", className: "text-xs rounded-md py-1.5 data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-100" }, "Referral Email"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "linkedin", className: "text-xs rounded-md py-1.5 data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-100" }, "LinkedIn Invite"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "linkedin_followup", className: "text-xs rounded-md py-1.5 data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-100" }, "LinkedIn Follow"), /* @__PURE__ */ React.createElement(TabsTrigger, { value: "short", className: "text-xs rounded-md py-1.5 data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-100" }, "Short Net")), (activeTab === "email" || activeTab === "referral") && /* @__PURE__ */ React.createElement("div", { className: "space-y-3 mb-3" }, /* @__PURE__ */ React.createElement("label", { className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500 block" }, "Email Subject"), /* @__PURE__ */ React.createElement(
    Input,
    {
      value: editedSubject,
      onChange: (e) => {
        setEditedSubject(e.target.value);
        onScoreUpdate(e.target.value, getCurrentText());
      },
      className: "bg-zinc-950 border-zinc-800 text-zinc-100"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500 block" }, "Message Body"), /* @__PURE__ */ React.createElement(
    Textarea,
    {
      value: getCurrentText(),
      onChange: (e) => handleTextChange(e.target.value),
      className: "min-h-[220px] bg-zinc-950 border-zinc-800 text-zinc-200 leading-relaxed font-sans text-sm focus-visible:ring-zinc-800"
    }
  )))));
};
