import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft, Copy, Check, FileEdit } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QualityScore } from "@/components/generate/QualityScore";
import { emailService } from "@/services/emailService";

export default function EmailDetailPage() {
  const { id } = useParams();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadEmail();
  }, [id]);

  const loadEmail = async () => {
    try {
      const { data } = await emailService.get(id);
      setEmail(data.email);
    } catch (error) {
      toast.error("Failed to load email");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.content}`);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Email not found</p>
        <Link to="/history">
          <Button variant="outline" className="mt-4">
            Back to History
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/history">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold">{email.jobTitle || "Email Detail"}</h1>
            <p className="text-xs text-muted-foreground">{email.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/generate?emailId=${email._id}`}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <FileEdit className="h-3.5 w-3.5" />
              Edit Email
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Email"}
          </Button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Email Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Subject */}
          <Card className="border-border/30 bg-card/50">
            <CardContent className="py-3 px-4">
              <p className="text-xs text-muted-foreground mb-1">Subject</p>
              <p className="text-sm font-medium">{email.subject}</p>
            </CardContent>
          </Card>

          {/* Body */}
          <Card className="border-border/30 bg-card/50">
            <CardContent className="py-4 px-5">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {email.content}
              </div>
            </CardContent>
          </Card>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs capitalize">
              {email.tone || "professional"}
            </Badge>
            <Badge
              variant={email.status === "sent" ? "default" : "secondary"}
              className={`text-xs capitalize ${
                email.status === "sent" ? "bg-emerald-500/10 text-emerald-400" : ""
              }`}
            >
              {email.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Created: {new Date(email.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Sidebar - Scores & Match */}
        <div className="space-y-4">
          <QualityScore scores={email.qualityScores} />

          {/* Match Info */}
          {email.matchAnalysis?.matchScore > 0 && (
            <Card className="border-border/30 bg-card/50">
              <CardContent className="py-4 px-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold">Match Score</h3>
                  <span
                    className={`text-lg font-bold ${
                      email.matchAnalysis.matchScore >= 80
                        ? "text-emerald-400"
                        : email.matchAnalysis.matchScore >= 60
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {email.matchAnalysis.matchScore}%
                  </span>
                </div>

                {email.matchAnalysis.matchingSkills?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground mb-1">Matching</p>
                    <div className="flex flex-wrap gap-1">
                      {email.matchAnalysis.matchingSkills.map((s, i) => (
                        <Badge key={i} className="text-[9px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {email.matchAnalysis.missingSkills?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground mb-1">Missing</p>
                    <div className="flex flex-wrap gap-1">
                      {email.matchAnalysis.missingSkills.map((s, i) => (
                        <Badge key={i} variant="outline" className="text-[9px] border-red-500/30 text-red-400">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
