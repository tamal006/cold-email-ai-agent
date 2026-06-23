import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link2, Upload, FileText, Sparkles, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobDetailsCard } from "@/components/generate/JobDetailsCard";
import { MatchAnalysisCard } from "@/components/generate/MatchAnalysisCard";
import { ResumeInsightsCard } from "@/components/generate/ResumeInsightsCard";
import { ToneSelector } from "@/components/generate/ToneSelector";
import { AIChatEditor } from "@/components/generate/AIChatEditor";
import { SubjectSelector } from "@/components/generate/SubjectSelector";
import { QualityScore } from "@/components/generate/QualityScore";
import { ExportButtons } from "@/components/generate/ExportButtons";
import { GenerationStepper } from "@/components/generate/GenerationStepper";
import { generateService } from "@/services/generateService";
import { resumeService } from "@/services/resumeService";
import { draftService } from "@/services/draftService";
import { emailService } from "@/services/emailService";

export default function GenerateEmailPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const loadedDraftId = searchParams.get("draftId");
  const loadedEmailId = searchParams.get("emailId");

  // Input state
  const [jobUrl, setJobUrl] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [userSummary, setUserSummary] = useState("");
  const [instructions, setInstructions] = useState("");

  // Resume list
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingDraft, setLoadingDraft] = useState(false);

  // Pipeline state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Result state
  const [result, setResult] = useState(null);
  const [emailId, setEmailId] = useState(null);

  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [isToneChanging, setIsToneChanging] = useState(false);
  const [isRegeneratingSubjects, setIsRegeneratingSubjects] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentTone, setCurrentTone] = useState("professional");
  const [isSaving, setIsSaving] = useState(false);

  // Load resumes on mount
  useEffect(() => {
    loadResumes();
  }, []);

  useEffect(() => {
    if (loadedDraftId) {
      loadDraft(loadedDraftId);
    } else if (loadedEmailId) {
      loadEmail(loadedEmailId);
    }
  }, [loadedDraftId, loadedEmailId]);

  const loadDraft = async (id) => {
    setLoadingDraft(true);
    try {
      const { data } = await draftService.get(id);
      const draft = data.draft;
      if (draft) {
        setResult({
          email: {
            _id: draft._id,
            jobTitle: draft.jobTitle,
            company: draft.company,
            subject: draft.subject,
            content: draft.content,
            htmlContent: draft.htmlContent,
            resumeProfileSnapshot: draft.resumeId ? { name: "Extracted Profile" } : {},
            qualityScores: draft.qualityScores,
          },
          jobAnalysis: {
            id: draft.jobId,
            title: draft.jobTitle,
            company: draft.company,
          },
          matchAnalysis: {
            matchScore: draft.matchScore || 0,
            matchingSkills: [],
            missingSkills: [],
            strengths: [],
            weaknesses: [],
          },
        });
        setEmailId(draft._id);
        if (draft.resumeId) setSelectedResumeId(draft.resumeId);
        if (draft.tone) setCurrentTone(draft.tone);
        if (draft.chatHistory) setChatHistory(draft.chatHistory);
      }
    } catch (error) {
      toast.error("Failed to load saved draft");
    } finally {
      setLoadingDraft(false);
    }
  };

  const loadEmail = async (id) => {
    setLoadingDraft(true);
    try {
      const { data } = await emailService.get(id);
      const email = data.email;
      if (email) {
        setResult({
          email: {
            _id: email._id,
            jobTitle: email.jobTitle,
            company: email.company,
            subject: email.subject,
            content: email.content,
            htmlContent: email.htmlContent,
            resumeProfileSnapshot: email.resumeProfileSnapshot || {},
            qualityScores: email.qualityScores,
            subjectOptions: email.subjectOptions || [],
          },
          jobAnalysis: {
            id: email.jobId?._id || email.jobId,
            title: email.jobTitle,
            company: email.company,
            skills: email.jobId?.skills || [],
            responsibilities: email.jobId?.responsibilities || [],
            description: email.jobId?.description || "",
          },
          matchAnalysis: {
            matchScore: email.matchAnalysis?.matchScore || 0,
            matchingSkills: email.matchAnalysis?.matchingSkills || [],
            missingSkills: email.matchAnalysis?.missingSkills || [],
            strengths: email.matchAnalysis?.strengths || [],
            weaknesses: email.matchAnalysis?.weaknesses || [],
          },
          subjectOptions: email.subjectOptions || [],
          qualityScores: email.qualityScores,
        });
        setEmailId(email._id);
        if (email.resumeId) setSelectedResumeId(email.resumeId);
        if (email.tone) setCurrentTone(email.tone);
        setChatHistory([]);
      }
    } catch (error) {
      toast.error("Failed to load email history item");
    } finally {
      setLoadingDraft(false);
    }
  };

  const loadResumes = async () => {
    try {
      const { data } = await resumeService.list();
      setResumes(data.resumes || []);
      // Auto-select default or first resume
      const defaultResume = data.resumes?.find((r) => r.isDefault) || data.resumes?.[0];
      if (defaultResume) setSelectedResumeId(defaultResume._id);
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoadingResumes(false);
    }
  };


  const handleGenerate = async () => {
    if (!jobUrl.trim()) {
      toast.error("Please enter a job URL");
      return;
    }
    if (!selectedResumeId) {
      toast.error("Please select or upload a resume first");
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setCompletedSteps([]);
    setChatHistory([]);
    setCurrentTone("professional");

    try {
      // Simulate step progress
      setCurrentStep("job");
      await new Promise((r) => setTimeout(r, 500));

      setCompletedSteps(["job"]);
      setCurrentStep("resume");
      await new Promise((r) => setTimeout(r, 300));

      setCompletedSteps(["job", "resume"]);
      setCurrentStep("email");

      const { data } = await generateService.runFullPipeline({
        jobUrl: jobUrl.trim(),
        resumeId: selectedResumeId,
        userSummary: userSummary.trim() || undefined,
        instructions: instructions.trim() || undefined,
      });

      setCompletedSteps(["job", "resume", "email", "score"]);
      setCurrentStep(null);

      setResult(data);
      setEmailId(data.email?._id);
      toast.success("Email generated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate email");
      setCurrentStep(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIEdit = async (message) => {
    if (!emailId) return;

    setIsEditing(true);
    setChatHistory((prev) => [...prev, { role: "user", content: message }]);

    try {
      const { data } = await generateService.editEmail({
        emailId,
        instruction: message,
        chatHistory,
      });

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: data.changeDescription || "Email updated" },
      ]);

      setResult((prev) => ({
        ...prev,
        email: data.email,
      }));
    } catch (error) {
      toast.error("Failed to edit email");
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't apply that change. Please try again." },
      ]);
    } finally {
      setIsEditing(false);
    }
  };

  const handleToneChange = async (tone) => {
    if (!emailId || tone === currentTone) return;

    setIsToneChanging(true);
    try {
      const { data } = await generateService.changeTone({ emailId, tone });
      setResult((prev) => ({ ...prev, email: data.email }));
      setCurrentTone(tone);
      toast.success(`Tone changed to ${tone}`);
    } catch (error) {
      toast.error("Failed to change tone");
    } finally {
      setIsToneChanging(false);
    }
  };

  const handleSubjectSelect = async (subject) => {
    if (!emailId) return;
    try {
      await generateService.updateSubject(emailId, subject);
      setResult((prev) => ({
        ...prev,
        email: { ...prev.email, subject },
      }));
    } catch (error) {
      toast.error("Failed to update subject");
    }
  };

  const handleRegenerateSubjects = async () => {
    if (!emailId) return;
    setIsRegeneratingSubjects(true);
    try {
      const { data } = await generateService.regenerateSubjects(emailId);
      setResult((prev) => ({
        ...prev,
        subjectOptions: data.subjects,
      }));
      toast.success("New subject lines generated!");
    } catch (error) {
      toast.error("Failed to regenerate subjects");
    } finally {
      setIsRegeneratingSubjects(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!result?.email) return;
    setIsSaving(true);
    try {
      const draftData = {
        jobId: result.jobAnalysis?.id || result.jobAnalysis?._id,
        resumeId: selectedResumeId || undefined,
        jobTitle: result.email.jobTitle,
        company: result.email.company,
        subject: result.email.subject,
        content: result.email.content,
        htmlContent: result.email.htmlContent,
        tone: currentTone,
        chatHistory,
        matchScore: result.matchAnalysis?.matchScore,
        qualityScores: result.qualityScores || result.email.qualityScores,
      };

      if (loadedDraftId) {
        await draftService.update(loadedDraftId, draftData);
        toast.success("Draft updated!");
      } else {
        const { data } = await draftService.save(draftData);
        toast.success("Draft saved!");
        setSearchParams({ draftId: data.draft._id });
        setEmailId(data.draft._id);
      }
    } catch (error) {
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingDraft) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Input form view (before generation)
  if (!result) {

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold gradient-text">Generate Application Email</h1>
          <p className="text-sm text-muted-foreground">
            Enter a job URL and select your resume to generate a personalized application email
          </p>
        </div>

        {/* Stepper - visible during generation */}
        {isGenerating && (
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6 pb-4">
              <GenerationStepper currentStep={currentStep} completedSteps={completedSteps} />
              <p className="text-xs text-muted-foreground text-center mt-3 animate-pulse">
                {currentStep === "job" && "Analyzing job posting..."}
                {currentStep === "resume" && "Matching your resume..."}
                {currentStep === "email" && "Crafting your personalized email..."}
                {currentStep === "score" && "Checking email quality..."}
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6 space-y-5">
            {/* Job URL */}
            <div className="space-y-2">
              <Label htmlFor="job-url" className="text-sm flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary" />
                Job Post URL <span className="text-red-400">*</span>
              </Label>
              <Input
                id="job-url"
                placeholder="https://linkedin.com/jobs/view/... or any job posting URL"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                disabled={isGenerating}
                className="bg-accent/30"
              />
              <p className="text-[10px] text-muted-foreground">
                Supports LinkedIn, Naukri, Internshala, company career pages, and more
              </p>
            </div>

            {/* Resume */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Resume <span className="text-red-400">*</span>
              </Label>
              {loadingResumes ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Loading resumes...
                </div>
              ) : resumes.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/50 p-4 text-center">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground mb-2">
                    No resumes uploaded yet
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = "/resume")}
                    className="text-xs"
                  >
                    Upload Resume
                  </Button>
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  disabled={isGenerating}
                  className="w-full h-10 rounded-md border border-input bg-accent/30 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option value="">Select a resume...</option>
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.fileName} {r.isDefault ? "(Default)" : ""} — {r.parsedProfile?.name || ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary" className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Personal Summary <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="summary"
                placeholder="e.g., I am a 4th semester CSE student with MERN experience. I won a hackathon recently."
                value={userSummary}
                onChange={(e) => setUserSummary(e.target.value)}
                disabled={isGenerating}
                rows={3}
                className="bg-accent/30 resize-none"
              />
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-sm">
                Additional Instructions <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="instructions"
                placeholder="e.g., Make the email sound confident but humble. Focus on my backend development skills."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                disabled={isGenerating}
                rows={2}
                className="bg-accent/30 resize-none"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !jobUrl.trim() || !selectedResumeId}
              className="w-full h-12 text-sm font-semibold gap-2"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Application Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Result view (after generation) — Split layout
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">
            {result.email?.jobTitle || "Application Email"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {result.email?.company} • Generated just now
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="text-xs gap-1.5"
          >
            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
            Save Draft
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setResult(null);
              setEmailId(null);
              setCompletedSteps([]);
              setChatHistory([]);
            }}
            className="text-xs"
          >
            New Email
          </Button>
        </div>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left Panel — Context */}
        <div className="lg:col-span-2 space-y-3">
          <JobDetailsCard job={result.jobAnalysis} />
          <MatchAnalysisCard match={result.matchAnalysis} />
          <ResumeInsightsCard profile={result.email?.resumeProfileSnapshot} />
          <QualityScore scores={result.qualityScores || result.email?.qualityScores} />
        </div>

        {/* Right Panel — Email Editor */}
        <div className="lg:col-span-3 space-y-3">
          {/* Subject Selector */}
          <SubjectSelector
            subjects={result.subjectOptions || result.email?.subjectOptions}
            currentSubject={result.email?.subject}
            onSelect={handleSubjectSelect}
            onRegenerate={handleRegenerateSubjects}
            isLoading={isRegeneratingSubjects}
          />

          {/* Email Preview */}
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {result.email?.content}
              </div>
            </div>
          </div>

          {/* Tone Selector */}
          <ToneSelector
            currentTone={currentTone}
            onToneChange={handleToneChange}
            isLoading={isToneChanging}
          />

          {/* Export */}
          <ExportButtons
            subject={result.email?.subject}
            content={result.email?.content}
            jobTitle={result.email?.jobTitle}
            company={result.email?.company}
          />

          {/* AI Chat Editor */}
          <AIChatEditor
            onSendMessage={handleAIEdit}
            isLoading={isEditing}
            chatHistory={chatHistory}
          />
        </div>
      </div>
    </div>
  );
}
