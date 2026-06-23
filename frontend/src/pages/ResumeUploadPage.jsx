import { useState, useEffect, useCallback } from "react";
import { Upload, FileText, Trash2, Star, StarOff, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resumeService } from "@/services/resumeService";

export default function ResumeUploadPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const loadResumes = useCallback(async () => {
    try {
      const { data } = await resumeService.list();
      setResumes(data.resumes || []);
    } catch (error) {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const handleUpload = async (file) => {
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext)) {
      toast.error("Unsupported file type. Please use PDF, DOCX, or TXT.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }

    setUploading(true);
    try {
      const { data } = await resumeService.upload(file);
      toast.success("Resume uploaded and parsed!");
      loadResumes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  const handleDelete = async (id) => {
    try {
      await resumeService.delete(id);
      toast.success("Resume deleted");
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      toast.error("Failed to delete resume");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await resumeService.setDefault(id);
      toast.success("Default resume updated");
      setResumes((prev) =>
        prev.map((r) => ({ ...r, isDefault: r._id === id }))
      );
    } catch (error) {
      toast.error("Failed to set default");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text">Resume Manager</h1>
        <p className="text-sm text-muted-foreground">
          Upload and manage your resumes. Supported formats: PDF, DOCX, TXT
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          dragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border/50 hover:border-border hover:bg-accent/20"
        } ${uploading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
        onClick={() => !uploading && document.getElementById("resume-input").click()}
      >
        <input
          id="resume-input"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
            <p className="text-sm font-medium">Uploading & Parsing Resume...</p>
            <p className="text-xs text-muted-foreground">Extracting skills, projects, and experience</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Drop your resume here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, or TXT • Max 10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Resume List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" />
        </div>
      ) : resumes.length === 0 ? (
        <Card className="border-border/30 bg-card/30">
          <CardContent className="py-8 text-center">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No resumes uploaded yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload your first resume to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Your Resumes ({resumes.length})
          </h2>
          {resumes.map((resume) => (
            <Card
              key={resume._id}
              className="border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {resume.fileName}
                        </p>
                        {resume.isDefault && (
                          <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {resume.parsedProfile?.name || "Unknown"} • {resume.parsedProfile?.skills?.length || 0} skills
                      </p>
                      {resume.parsedProfile?.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resume.parsedProfile.skills.slice(0, 8).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0">
                              {skill}
                            </Badge>
                          ))}
                          {resume.parsedProfile.skills.length > 8 && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                              +{resume.parsedProfile.skills.length - 8}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSetDefault(resume._id)}
                      className="h-8 w-8"
                      title={resume.isDefault ? "Default resume" : "Set as default"}
                    >
                      {resume.isDefault ? (
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(resume._id)}
                      className="h-8 w-8 text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
