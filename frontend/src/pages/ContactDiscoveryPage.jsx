import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { contactService } from "@/services/contactService";
import { jobService } from "@/services/jobService";
import { ContactCard } from "@/components/contacts/ContactCard";
import { CompanyInsightCard } from "@/components/contacts/CompanyInsightCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Users, RefreshCw, ChevronLeft, Loader2, Building2 } from "lucide-react";
export const ContactDiscoveryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);
  useEffect(() => {
    if (jobId) {
      fetchJobAndContacts();
    } else {
      toast.error("No Job ID specified.");
      navigate("/jobs");
    }
  }, [jobId]);
  const fetchJobAndContacts = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const jobData = await jobService.getJobById(jobId);
      setJob(jobData);
      const data = await contactService.getContactsForJob(jobId);
      setCompany(data.company);
      setContacts(data.contacts);
      if (data.contacts.length === 0) {
        handleDiscover();
      }
    } catch (error) {
      console.error("Fetch contacts error:", error);
      toast.error("Failed to load contacts details.");
    } finally {
      setLoading(false);
    }
  };
  const handleDiscover = async () => {
    if (!jobId) return;
    setDiscovering(true);
    try {
      const res = await contactService.discoverContacts(jobId);
      setCompany(res.company);
      setContacts(res.contacts);
      toast.success("Contacts discovered successfully!");
    } catch (error) {
      console.error("Discover error:", error);
      toast.error(error.response?.data?.message || "Failed to discover contacts.");
    } finally {
      setDiscovering(false);
    }
  };
  const handleSaveToggle = async (contactId) => {
    try {
      const updated = await contactService.toggleSaveContact(contactId);
      setContacts((prev) => prev.map((c) => c._id === contactId ? { ...c, saved: updated.saved } : c));
      toast.success(updated.saved ? "Contact saved to shortlist" : "Contact removed from shortlist");
    } catch (error) {
      toast.error("Failed to update contact status.");
    }
  };
  const handleGenerateOutreach = (contact, type) => {
    navigate(`/outreach?jobId=${jobId}&contactId=${contact._id}&type=${type}`);
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center min-h-[500px] space-y-4" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-10 w-10 text-primary animate-spin" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400" }, "Loading company and job details..."));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6 max-w-6xl mx-auto px-4 py-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col space-y-3 pb-4 border-b border-zinc-900" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-zinc-400 hover:text-zinc-200", onClick: () => navigate("/jobs") }, /* @__PURE__ */ React.createElement(ChevronLeft, { className: "h-5 w-5" })), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-zinc-500 uppercase tracking-widest font-semibold" }, "Job Outreach")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-black text-zinc-150 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Users, { className: "h-5.5 w-5.5 text-primary" }), " Discover Hiring Contacts"), job && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-zinc-400 mt-1" }, "Finding recruiting managers and team members for ", /* @__PURE__ */ React.createElement("span", { className: "text-zinc-300 font-semibold" }, job.title), " at ", /* @__PURE__ */ React.createElement("span", { className: "text-zinc-300 font-semibold" }, job.company))), /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: handleDiscover,
      disabled: discovering,
      variant: "outline",
      className: "border-zinc-800 text-zinc-300 hover:bg-zinc-900/60"
    },
    discovering ? /* @__PURE__ */ React.createElement(RefreshCw, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ React.createElement(RefreshCw, { className: "mr-2 h-4 w-4" }),
    "Re-discover Contacts"
  ))), discovering ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center py-20 space-y-4 border border-zinc-850 rounded-xl bg-zinc-950/40" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-8 w-8 text-primary animate-spin" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400" }, "Analyzing company directories and suggesting relevant roles..."), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-zinc-650 max-w-sm text-center" }, "Using only publicly available sources. Never guessing emails or fabricating details.")) : /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-2 space-y-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-zinc-400 uppercase tracking-wider" }, "Ranked Contacts"), contacts.length === 0 ? /* @__PURE__ */ React.createElement(Card, { className: "border border-dashed border-zinc-800 bg-transparent py-16" }, /* @__PURE__ */ React.createElement(CardContent, { className: "flex flex-col items-center justify-center space-y-3" }, /* @__PURE__ */ React.createElement(Users, { className: "h-8 w-8 text-zinc-700" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400 text-center" }, "No contacts discovered yet. Click Discover above."))) : /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, contacts.map((contact) => /* @__PURE__ */ React.createElement(
    ContactCard,
    {
      key: contact._id,
      contact,
      onSaveToggle: handleSaveToggle,
      onGenerateOutreach: handleGenerateOutreach
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-zinc-400 uppercase tracking-wider" }, "Company Profile"), company ? /* @__PURE__ */ React.createElement(CompanyInsightCard, { company }) : /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-900 bg-zinc-950/20 py-8" }, /* @__PURE__ */ React.createElement(CardContent, { className: "flex flex-col items-center justify-center" }, /* @__PURE__ */ React.createElement(Building2, { className: "h-6 w-6 text-zinc-700 mb-2" }), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-zinc-500" }, "No company details loaded."))))));
};
