import { Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SubjectSelector({ subjects = [], currentSubject, onSelect, onRegenerate, isLoading }) {
  if (!subjects?.length && !currentSubject) return null;

  const allSubjects = currentSubject && !subjects.includes(currentSubject)
    ? [currentSubject, ...subjects]
    : subjects.length > 0 ? subjects : [currentSubject];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Subject Line</p>
        {onRegenerate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading}
            className="h-6 px-2 text-[10px] gap-1"
          >
            <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
            Regenerate
          </Button>
        )}
      </div>
      <div className="space-y-1.5">
        {allSubjects.map((subject, i) => (
          <button
            key={i}
            onClick={() => onSelect(subject)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 flex items-center gap-2",
              "border hover:bg-accent/50",
              currentSubject === subject
                ? "border-primary/40 bg-primary/5 text-foreground"
                : "border-border/30 text-muted-foreground hover:border-border"
            )}
          >
            <div
              className={cn(
                "h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
                currentSubject === subject
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30"
              )}
            >
              {currentSubject === subject && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
            </div>
            <span className="truncate">{subject}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
