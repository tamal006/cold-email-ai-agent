import React, { useState, useEffect } from "react";
import { trackerService } from "@/services/trackerService";
import { TrackerBoard } from "@/components/tracker/TrackerBoard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowRightLeft, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const JobTrackerPage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchTrackedJobs();
  }, []);
  const fetchTrackedJobs = async () => {
    setLoading(true);
    try {
      const data = await trackerService.getTrackedJobs();
      setEntries(data);
    } catch (error) {
      console.error("Fetch tracked jobs error:", error);
      toast.error("Failed to load tracked jobs.");
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await trackerService.updateTrackerStatus(id, newStatus);
      setEntries((prev) => prev.map((e) => e._id === id ? { ...e, status: updated.status, statusHistory: updated.statusHistory } : e));
      toast.success(`Application status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };
  const handleDeleteEntry = async (id) => {
    try {
      await trackerService.deleteTrackerEntry(id);
      setEntries((prev) => prev.filter((e) => e._id !== id));
      toast.success("Tracked job deleted.");
    } catch (error) {
      toast.error("Failed to delete tracked job.");
    }
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center min-h-[500px] space-y-4" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-10 w-10 text-primary animate-spin" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400" }, "Loading your job application pipeline..."));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6 max-w-7xl mx-auto px-4 py-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-zinc-900 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-black tracking-tight text-zinc-100 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ArrowRightLeft, { className: "text-primary h-6 w-6" }), " Job Tracker Pipeline"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-400 mt-1" }, "Manage and track your job application process and outreach outreach history.")), /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: () => navigate("/jobs"),
      className: "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
    },
    /* @__PURE__ */ React.createElement(Plus, { className: "mr-2 h-4 w-4" }),
    " Add Job URL"
  )), /* @__PURE__ */ React.createElement(
    TrackerBoard,
    {
      entries,
      onStatusChange: handleStatusChange,
      onDelete: handleDeleteEntry
    }
  ));
};
