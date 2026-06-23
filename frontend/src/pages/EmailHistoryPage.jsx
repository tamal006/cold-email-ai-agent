import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, Mail, Trash2, Inbox, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { emailService } from "@/services/emailService";

export default function EmailHistoryPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      const { data } = await emailService.list();
      setEmails(data.emails || []);
    } catch (error) {
      toast.error("Failed to load emails");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await emailService.delete(id);
      setEmails((prev) => prev.filter((e) => e._id !== id));
      toast.success("Email deleted");
    } catch (error) {
      toast.error("Failed to delete email");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text">Email History</h1>
        <p className="text-sm text-muted-foreground">
          All your generated application emails
        </p>
      </div>

      {emails.length === 0 ? (
        <Card className="border-border/30 bg-card/30">
          <CardContent className="py-12 text-center">
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No emails generated yet</p>
            <Link to="/generate">
              <Button className="mt-4" size="sm">
                Generate Your First Email
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {emails.map((email) => (
            <Card
              key={email._id}
              className="border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary shrink-0" />
                      <Link
                        to={`/history/${email._id}`}
                        className="text-sm font-semibold truncate hover:text-primary transition-colors"
                      >
                        {email.subject || "Untitled Email"}
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      {email.jobTitle || "Unknown Position"} at {email.company || "Unknown Company"}
                    </p>
                    <div className="flex items-center gap-2 mt-2 ml-6">
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {email.tone || "professional"}
                      </Badge>
                      {email.qualityScores?.overallScore > 0 && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            email.qualityScores.overallScore >= 80
                              ? "text-emerald-400 border-emerald-500/30"
                              : email.qualityScores.overallScore >= 60
                              ? "text-amber-400 border-amber-500/30"
                              : "text-red-400 border-red-500/30"
                          }`}
                        >
                          Quality: {email.qualityScores.overallScore}
                        </Badge>
                      )}
                      {email.matchAnalysis?.matchScore > 0 && (
                        <Badge variant="outline" className="text-[10px]">
                          Match: {email.matchAnalysis.matchScore}%
                        </Badge>
                      )}
                      <Badge
                        variant={email.status === "sent" ? "default" : "secondary"}
                        className={`text-[10px] capitalize ${
                          email.status === "sent" ? "bg-emerald-500/10 text-emerald-400" : ""
                        }`}
                      >
                        {email.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(email.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link to={`/history/${email._id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(email._id)}
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
