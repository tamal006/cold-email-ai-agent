import { cn } from "@/lib/utils";

const TONES = [
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "friendly", label: "Friendly", emoji: "😊" },
  { id: "formal", label: "Formal", emoji: "🎩" },
  { id: "confident", label: "Confident", emoji: "💪" },
  { id: "enthusiastic", label: "Enthusiastic", emoji: "🔥" },
  { id: "corporate", label: "Corporate", emoji: "🏢" },
  { id: "startup", label: "Startup", emoji: "🚀" },
  { id: "minimal", label: "Minimal", emoji: "✨" },
  { id: "recruiter-friendly", label: "Recruiter", emoji: "🎯" },
];

export function ToneSelector({ currentTone, onToneChange, isLoading }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Tone</p>
      <div className="flex flex-wrap gap-1.5">
        {TONES.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onToneChange(tone.id)}
            disabled={isLoading || currentTone === tone.id}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
              "border hover:scale-105 active:scale-95",
              currentTone === tone.id
                ? "bg-primary/15 border-primary/40 text-primary shadow-sm shadow-primary/10"
                : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border hover:bg-accent/50",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            <span>{tone.emoji}</span>
            <span>{tone.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
