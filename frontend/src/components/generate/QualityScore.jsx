import { cn } from "@/lib/utils";

const SCORE_LABELS = [
  { key: "professionalismScore", label: "Professionalism", color: "bg-blue-500" },
  { key: "personalizationScore", label: "Personalization", color: "bg-purple-500" },
  { key: "grammarScore", label: "Grammar", color: "bg-emerald-500" },
  { key: "readabilityScore", label: "Readability", color: "bg-amber-500" },
  { key: "recruiterAppealScore", label: "Recruiter Appeal", color: "bg-pink-500" },
  { key: "ctaScore", label: "CTA Strength", color: "bg-cyan-500" },
];

export function QualityScore({ scores, compact = false }) {
  if (!scores) return null;

  const getOverallColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={cn("text-sm font-bold", getOverallColor(scores.overallScore))}>
          {scores.overallScore}/100
        </span>
        <span className="text-xs text-muted-foreground">Quality</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold">Email Quality</h3>
        <div className={cn("text-lg font-bold", getOverallColor(scores.overallScore))}>
          {scores.overallScore}
          <span className="text-xs text-muted-foreground font-normal">/100</span>
        </div>
      </div>

      <div className="space-y-2">
        {SCORE_LABELS.map(({ key, label, color }) => (
          <div key={key} className="space-y-0.5">
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{scores[key] || 0}</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700 ease-out", color)}
                style={{ width: `${scores[key] || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {scores.suggestions?.length > 0 && (
        <div className="pt-2 border-t border-border/30">
          <p className="text-[10px] font-medium mb-1 text-muted-foreground">Suggestions</p>
          <ul className="space-y-0.5">
            {scores.suggestions.slice(0, 3).map((s, i) => (
              <li key={i} className="text-[10px] text-muted-foreground flex gap-1.5">
                <span className="text-amber-400">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
