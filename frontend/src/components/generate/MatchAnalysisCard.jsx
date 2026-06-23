import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, TrendingUp, TrendingDown } from "lucide-react";

export function MatchAnalysisCard({ match }) {
  if (!match) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-emerald-500/20";
    if (score >= 60) return "bg-amber-500/20";
    return "bg-red-500/20";
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Match Analysis</h3>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getScoreBg(match.matchScore)}`}>
          <span className={`text-lg font-bold ${getScoreColor(match.matchScore)}`}>
            {match.matchScore}%
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            match.matchScore >= 80
              ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
              : match.matchScore >= 60
              ? "bg-gradient-to-r from-amber-500 to-amber-400"
              : "bg-gradient-to-r from-red-500 to-red-400"
          }`}
          style={{ width: `${match.matchScore}%` }}
        />
      </div>

      {/* Matching Skills */}
      {match.matchingSkills?.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Matching Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {match.matchingSkills.map((skill, i) => (
              <Badge
                key={i}
                className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {match.missingSkills?.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5 text-red-400" />
            Missing Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {match.missingSkills.map((skill, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-[10px] px-2 py-0.5 border-red-500/30 text-red-400"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Strengths */}
      {match.strengths?.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Strengths
          </p>
          <ul className="space-y-1">
            {match.strengths.map((s, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2">
                <span className="text-emerald-400">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {match.weaknesses?.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
            <TrendingDown className="h-3.5 w-3.5 text-amber-400" />
            Areas to Address
          </p>
          <ul className="space-y-1">
            {match.weaknesses.map((w, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2">
                <span className="text-amber-400">-</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      {match.recommendation && (
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground italic">{match.recommendation}</p>
        </div>
      )}
    </div>
  );
}
