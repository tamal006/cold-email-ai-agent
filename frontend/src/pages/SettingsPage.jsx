import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User as UserIcon, FileText, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
export default function SettingsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [headline, setHeadline] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [projects, setProjects] = useState([]);
  const [newProjName, setNewProjName] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState("");
  useEffect(() => {
    fetchProfile();
  }, []);
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await authService.getProfile();
      setProfile(data.user);
      setHeadline(data.user.headline || "");
      setSkillsStr(data.user.skills?.join(", ") || "");
      setExperience(data.user.experience || "");
      setEducation(data.user.education || "");
      setResumeText(data.user.resumeText || "");
      setProjects(data.user.projects || []);
      setAchievements(data.user.achievements || []);
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Failed to load profile settings.");
    } finally {
      setLoading(false);
    }
  };
  const handleAddProject = () => {
    if (!newProjName || !newProjDesc) {
      toast.error("Please fill in project name and description.");
      return;
    }
    const newProj = { name: newProjName, description: newProjDesc };
    setProjects((prev) => [...prev, newProj]);
    setNewProjName("");
    setNewProjDesc("");
  };
  const handleRemoveProject = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };
  const handleAddAchievement = () => {
    if (!newAchievement) return;
    setAchievements((prev) => [...prev, newAchievement]);
    setNewAchievement("");
  };
  const handleRemoveAchievement = (index) => {
    setAchievements((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const skillsArray = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await authService.updateProfile({
        headline,
        skills: skillsArray,
        experience,
        education,
        resumeText,
        projects,
        achievements
      });
      setProfile(res.user);
      toast.success("Professional profile saved successfully.");
    } catch (error) {
      console.error("Save profile error:", error);
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center min-h-[400px]" }, /* @__PURE__ */ React.createElement("p", { className: "text-zinc-500 animate-pulse text-sm" }, "Loading your profile preferences..."));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto space-y-6 pb-12" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-black text-zinc-150" }, "Settings & Profile"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-zinc-500 mt-0.5" }, "Customize SMTP credentials and update your candidate resume profile.")), /* @__PURE__ */ React.createElement(Button, { onClick: handleSave, disabled: saving, className: "bg-zinc-100 text-zinc-950 hover:bg-zinc-200" }, saving ? "Saving..." : "Save Settings")), /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-zinc-950/60 backdrop-blur-md" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-primary" }, /* @__PURE__ */ React.createElement(UserIcon, { className: "h-5 w-5" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg" }, "Account Profile"), /* @__PURE__ */ React.createElement(CardDescription, null, "Your main credential details")))), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-4 text-xs text-zinc-300" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "settings-name" }, "Name"), /* @__PURE__ */ React.createElement(Input, { id: "settings-name", value: profile?.name || "", readOnly: true, className: "bg-zinc-900 border-zinc-850" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "settings-email" }, "Email"), /* @__PURE__ */ React.createElement(Input, { id: "settings-email", value: profile?.email || "", readOnly: true, className: "bg-zinc-900 border-zinc-850" }))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement(Label, null, "Member Since"), /* @__PURE__ */ React.createElement("p", { className: "text-zinc-500" }, profile?.createdAt ? format(new Date(profile.createdAt), "MMMM d, yyyy") : "N/A")))), /* @__PURE__ */ React.createElement(Card, { className: "border border-zinc-800 bg-zinc-950/60 backdrop-blur-md" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400" }, /* @__PURE__ */ React.createElement(FileText, { className: "h-5 w-5" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg" }, "AI Personalization Profile"), /* @__PURE__ */ React.createElement(CardDescription, null, "This information powers the AI outreach generator and resume matching engine.")))), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-5 text-sm text-zinc-300" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement(Label, null, "Headline / Target Role"), /* @__PURE__ */ React.createElement(
    Input,
    {
      placeholder: "e.g. Senior Full-Stack Engineer | MERN Specialist",
      value: headline,
      onChange: (e) => setHeadline(e.target.value),
      className: "bg-zinc-950 border-zinc-800 text-zinc-200"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement(Label, null, "Education Details"), /* @__PURE__ */ React.createElement(
    Input,
    {
      placeholder: "e.g. B.Tech in Computer Science, 2024",
      value: education,
      onChange: (e) => setEducation(e.target.value),
      className: "bg-zinc-950 border-zinc-800 text-zinc-200"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement(Label, null, "Years of Experience"), /* @__PURE__ */ React.createElement(
    Input,
    {
      placeholder: "e.g. 2 Years, 0-1 Years",
      value: experience,
      onChange: (e) => setExperience(e.target.value),
      className: "bg-zinc-950 border-zinc-800 text-zinc-200"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement(Label, null, "Skills (comma separated)"), /* @__PURE__ */ React.createElement(
    Input,
    {
      placeholder: "React, TypeScript, Node.js, Express, MongoDB, Python, Docker",
      value: skillsStr,
      onChange: (e) => setSkillsStr(e.target.value),
      className: "bg-zinc-950 border-zinc-800 text-zinc-200"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement(Label, null, "Raw Resume Text"), /* @__PURE__ */ React.createElement(
    Textarea,
    {
      placeholder: "Paste your full text resume here for deep semantic resume matching and project mapping...",
      value: resumeText,
      onChange: (e) => setResumeText(e.target.value),
      className: "min-h-[160px] bg-zinc-950 border-zinc-800 text-zinc-300 text-xs"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 pt-3 border-t border-zinc-900" }, /* @__PURE__ */ React.createElement(Label, { className: "text-zinc-400 font-bold uppercase tracking-wider text-[10px]" }, "Projects"), projects.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "space-y-2 mb-3" }, projects.map((proj, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "flex items-start justify-between p-2.5 rounded bg-zinc-900 border border-zinc-900 text-xs" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h6", { className: "font-bold text-zinc-200" }, proj.name), /* @__PURE__ */ React.createElement("p", { className: "text-zinc-500 mt-0.5" }, proj.description)), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 text-zinc-650 hover:text-red-400", onClick: () => handleRemoveProject(idx) }, /* @__PURE__ */ React.createElement(Trash2, { className: "h-3 w-3" }))))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 p-3 rounded-lg border border-dashed border-zinc-850" }, /* @__PURE__ */ React.createElement(
    Input,
    {
      placeholder: "Project Name",
      value: newProjName,
      onChange: (e) => setNewProjName(e.target.value),
      className: "bg-zinc-950 border-zinc-800 text-xs"
    }
  ), /* @__PURE__ */ React.createElement(
    Textarea,
    {
      placeholder: "Brief project details (technologies used, features built)",
      value: newProjDesc,
      onChange: (e) => setNewProjDesc(e.target.value),
      className: "bg-zinc-950 border-zinc-800 text-xs min-h-[60px]"
    }
  ), /* @__PURE__ */ React.createElement(Button, { size: "sm", variant: "outline", className: "w-full text-xs border-zinc-800 text-zinc-400", onClick: handleAddProject }, /* @__PURE__ */ React.createElement(Plus, { className: "mr-1.5 h-3.5 w-3.5" }), " Add Project"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 pt-3 border-t border-zinc-900" }, /* @__PURE__ */ React.createElement(Label, { className: "text-zinc-400 font-bold uppercase tracking-wider text-[10px]" }, "Key Achievements & Awards"), achievements.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 mb-3" }, achievements.map((ach, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-900 text-xs text-zinc-300" }, /* @__PURE__ */ React.createElement("span", null, ach), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 text-zinc-650 hover:text-red-400", onClick: () => handleRemoveAchievement(idx) }, /* @__PURE__ */ React.createElement(Trash2, { className: "h-3 w-3" }))))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
    Input,
    {
      placeholder: "e.g. Won Hackathon out of 100 teams",
      value: newAchievement,
      onChange: (e) => setNewAchievement(e.target.value),
      className: "bg-zinc-950 border-zinc-800 text-xs"
    }
  ), /* @__PURE__ */ React.createElement(Button, { size: "sm", variant: "outline", className: "border-zinc-800 text-zinc-455", onClick: handleAddAchievement }, "Add"))))));
}
