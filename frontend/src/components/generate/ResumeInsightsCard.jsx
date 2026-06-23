import { User, GraduationCap, Code, FolderGit2, Award, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ResumeInsightsCard({ profile }) {
  const [expanded, setExpanded] = useState(false);

  if (!profile) return null;

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-sm">{profile.name || "Resume Insights"}</h3>
            <p className="text-xs text-muted-foreground">
              {profile.skills?.length || 0} skills • {profile.projects?.length || 0} projects
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in">
          {/* Education */}
          {profile.education?.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-blue-400" /> Education
              </p>
              {profile.education.map((edu, i) => (
                <p key={i} className="text-xs text-muted-foreground">
                  {edu.degree} — {edu.institution} ({edu.year})
                </p>
              ))}
            </div>
          )}

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-emerald-400" /> Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.slice(0, 15).map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5">
                    {skill}
                  </Badge>
                ))}
                {profile.skills.length > 15 && (
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                    +{profile.skills.length - 15} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Projects */}
          {profile.projects?.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
                <FolderGit2 className="h-3.5 w-3.5 text-purple-400" /> Projects
              </p>
              <ul className="space-y-1.5">
                {profile.projects.slice(0, 4).map((p, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{p.name}</span>
                    {p.techStack?.length > 0 && (
                      <span className="text-muted-foreground"> [{p.techStack.join(", ")}]</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Achievements */}
          {profile.achievements?.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-400" /> Achievements
              </p>
              <ul className="space-y-1">
                {profile.achievements.map((a, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-amber-400">★</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hackathons */}
          {profile.hackathons?.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-orange-400" /> Hackathons
              </p>
              <ul className="space-y-1">
                {profile.hackathons.map((h, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-orange-400">🏆</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
