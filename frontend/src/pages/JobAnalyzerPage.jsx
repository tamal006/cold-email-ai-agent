import { useState, useEffect } from "react";
import { Link2, Loader2, Briefcase, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { jobService } from "@/services/jobService";

export function JobAnalyzerPage() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastAnalyzed, setLastAnalyzed] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const { data } = await jobService.list();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error("Please enter a job URL");
      return;
    }

    setAnalyzing(true);
    setLastAnalyzed(null);
    try {
      const { data } = await jobService.analyze(url.trim());
      setLastAnalyzed(data.job);
      setJobs((prev) => [data.job, ...prev]);
      setUrl("");
      toast.success("Job analyzed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to analyze job");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await jobService.delete(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success("Job deleted");
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text">Job Analyzer</h1>
        <p className="text-sm text-muted-foreground">
          Analyze job postings to extract skills, requirements, and responsibilities
        </p>
      </div>

      {/* Analyze Form */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              Job Post URL
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://linkedin.com/jobs/view/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={analyzing}
                className="bg-accent/30"
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
              <Button onClick={handleAnalyze} disabled={analyzing || !url.trim()} className="shrink-0 gap-2">
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Analyzed Result */}
      {lastAnalyzed && (
        <Card className="border-primary/20 bg-primary/5 animate-fade-in">
          <CardContent className="py-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold">{lastAnalyzed.title}</h3>
                <p className="text-xs text-muted-foreground">{lastAnalyzed.company} • {lastAnalyzed.location}</p>
              </div>
            </div>

            {lastAnalyzed.description && (
              <p className="text-xs text-muted-foreground">{lastAnalyzed.description}</p>
            )}

            {lastAnalyzed.skills?.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-1.5">Required Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {lastAnalyzed.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {lastAnalyzed.responsibilities?.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-1.5">Responsibilities</p>
                <ul className="space-y-1">
                  {lastAnalyzed.responsibilities.slice(0, 5).map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Job History */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" />
        </div>
      ) : jobs.length === 0 ? (
        <Card className="border-border/30 bg-card/30">
          <CardContent className="py-8 text-center">
            <Inbox className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-xs text-muted-foreground">No jobs analyzed yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Analyzed Jobs ({jobs.length})
          </h2>
          {jobs.map((job) => (
            <Card key={job._id} className="border-border/30 bg-card/50 hover:bg-card/80 transition-colors">
              <CardContent className="py-3 px-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{job.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground">{job.company}</p>
                    <Badge variant="secondary" className="text-[9px] capitalize">{job.platform}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(job._id)}
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
