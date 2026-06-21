import React, { useState, useEffect } from "react";
import { jobService } from "@/services/jobService";
import { trackerService } from "@/services/trackerService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/job/JobCard";
import { AnalysisProgress } from "@/components/job/AnalysisProgress";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Search, Link as LinkIcon, AlertCircle, FileSearch } from "lucide-react";
export const JobAnalyzerPage = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [trackerJobIds, setTrackerJobIds] = useState(/* @__PURE__ */ new Set());
  const [currentJob, setCurrentJob] = useState(null);
  useEffect(() => {
    fetchJobs();
    fetchTrackedJobs();
  }, []);
  const fetchJobs = async () => {
    try {
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Fetch jobs error:", error);
      toast.error("Failed to load analyzed jobs.");
    }
  };
  const fetchTrackedJobs = async () => {
    try {
      const tracked = await trackerService.getTrackedJobs();
      const ids = new Set(tracked.map((t) => t.jobId?._id));
      setTrackerJobIds(ids);
    } catch (error) {
      console.error("Fetch tracked jobs error:", error);
    }
  };
  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) {
      toast.error("Please enter a valid job URL.");
      return;
    }
    setAnalyzing(true);
    setCurrentJob(null);
    try {
      const job = await jobService.analyzeJob(url);
      setCurrentJob(job);
      toast.success("Job analyzed successfully!");
      fetchJobs();
    } catch (error) {
      console.error("Analyze job error:", error);
      toast.error(error.response?.data?.message || "Failed to analyze job URL. Please check compliance rules and try again.");
      setAnalyzing(false);
    }
  };
  const handleFindContacts = (jobId) => {
    navigate(`/contacts?jobId=${jobId}`);
  };
  const handleTrackJob = async (jobId) => {
    try {
      await trackerService.addTrackedJob({ jobId });
      toast.success("Job added to tracker!");
      fetchTrackedJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to track job.");
    }
  };
  const handleDeleteJob = async (jobId) => {
    try {
      await jobService.deleteJob(jobId);
      toast.success("Job analysis deleted.");
      if (currentJob?._id === jobId) setCurrentJob(null);
      fetchJobs();
    } catch (error) {
      toast.error("Failed to delete job.");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-8 max-w-6xl mx-auto px-4 py-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 pb-6 border-b border-zinc-900" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-black tracking-tight text-zinc-100 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(FileSearch, { className: "text-primary h-6 w-6" }), " Job URL Analyzer"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400 mt-1" }, "Paste a job posting URL to extract job requirements, analyze skills, and identify contacts."))), /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-zinc-950/60 backdrop-blur-md" }, /* @__PURE__ */ React.createElement(CardContent, { className: "pt-6" }, /* @__PURE__ */ React.createElement("form", { onSubmit: handleAnalyze, className: "flex gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ React.createElement(LinkIcon, { className: "absolute left-3 top-3 h-4 w-4 text-zinc-500" }), /* @__PURE__ */ React.createElement(
    Input,
    {
      type: "url",
      placeholder: "Paste LinkedIn, Naukri, Internshala, or any public careers page URL...",
      value: url,
      onChange: (e) => setUrl(e.target.value),
      disabled: analyzing,
      className: "pl-10 bg-zinc-950 border-zinc-800 text-zinc-200 focus-visible:ring-zinc-800"
    }
  )), /* @__PURE__ */ React.createElement(
    Button,
    {
      type: "submit",
      disabled: analyzing || !url,
      className: "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
    },
    "Analyze URL"
  )), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex items-center gap-1.5 text-[10px] text-zinc-500" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ React.createElement("span", null, "Compliant with public guidelines. No private profiles scraped. Only public details used.")))), analyzing && !currentJob && /* @__PURE__ */ React.createElement("div", { className: "py-8" }, /* @__PURE__ */ React.createElement(AnalysisProgress, { onComplete: () => setAnalyzing(false) })), currentJob && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-zinc-200 uppercase tracking-wider" }, "Analysis Result"), /* @__PURE__ */ React.createElement("div", { className: "max-w-xl" }, /* @__PURE__ */ React.createElement(
    JobCard,
    {
      job: currentJob,
      onFindContacts: handleFindContacts,
      onTrackJob: handleTrackJob,
      onDelete: handleDeleteJob,
      isTracking: trackerJobIds.has(currentJob._id)
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4 pt-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-zinc-250 uppercase tracking-wider" }, "Recent Analyses"), jobs.length === 0 ? /* @__PURE__ */ React.createElement(Card, { className: "border border-dashed border-zinc-800 bg-transparent py-12" }, /* @__PURE__ */ React.createElement(CardContent, { className: "flex flex-col items-center justify-center space-y-3" }, /* @__PURE__ */ React.createElement(Search, { className: "h-8 w-8 text-zinc-600" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400 text-center" }, "No jobs analyzed yet. Paste a URL above to start."))) : /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, jobs.map((job) => /* @__PURE__ */ React.createElement(
    JobCard,
    {
      key: job._id,
      job,
      onFindContacts: handleFindContacts,
      onTrackJob: handleTrackJob,
      onDelete: handleDeleteJob,
      isTracking: trackerJobIds.has(job._id)
    }
  )))));
};
