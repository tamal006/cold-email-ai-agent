import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileEdit, Trash2, Calendar, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { draftService } from "@/services/draftService";


export default function SavedDraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const { data } = await draftService.list();
      setDrafts(data.drafts || []);
    } catch (error) {
      toast.error("Failed to load drafts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await draftService.delete(id);
      setDrafts((prev) => prev.filter((d) => d._id !== id));
      toast.success("Draft deleted");
    } catch (error) {
      toast.error("Failed to delete draft");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        <h1 className="text-2xl font-bold gradient-text">Saved Drafts</h1>
        <p className="text-sm text-muted-foreground">
          Your saved email drafts for ongoing applications
        </p>
      </div>

      {drafts.length === 0 ? (
        <Card className="border-border/30 bg-card/30">
          <CardContent className="py-12 text-center">
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No saved drafts</p>
            <p className="text-xs text-muted-foreground mt-1">
              Drafts are saved when you click "Save Draft" after generating an email
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => (
            <Card
              key={draft._id}
              className="border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold truncate">{draft.subject}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground truncate">
                        {draft.jobTitle || "Unknown Position"} at {draft.company || "Unknown Company"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {draft.tone || "professional"}
                      </Badge>
                      {draft.matchScore > 0 && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            draft.matchScore >= 80
                              ? "text-emerald-400 border-emerald-500/30"
                              : draft.matchScore >= 60
                              ? "text-amber-400 border-amber-500/30"
                              : "text-red-400 border-red-500/30"
                          }`}
                        >
                          {draft.matchScore}% match
                        </Badge>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(draft.lastEditedAt || draft.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link to={`/generate?draftId=${draft._id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(draft._id)}
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
