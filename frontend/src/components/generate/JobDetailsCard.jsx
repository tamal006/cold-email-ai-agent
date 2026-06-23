import { ChevronDown, ChevronUp, MapPin, Briefcase, Clock, DollarSign } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function JobDetailsCard({ job }) {
  const [expanded, setExpanded] = useState(false);

  if (!job) return null;

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-sm">{job.title}</h3>
            <p className="text-xs text-muted-foreground">{job.company}</p>
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
          {/* Location & Type */}
          <div className="flex flex-wrap gap-2 text-xs">
            {job.location && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" /> {job.location}
              </span>
            )}
            {job.jobType && job.jobType !== "unknown" && (
              <Badge variant="secondary" className="text-xs capitalize">
                {job.jobType}
              </Badge>
            )}
            {job.experienceRequired && job.experienceRequired !== "Not specified" && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" /> {job.experienceRequired}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="h-3 w-3" /> {job.salary}
              </span>
            )}
          </div>

          {/* Description */}
          {job.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">{job.description}</p>
          )}

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1.5">Required Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] px-2 py-0.5">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities?.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1.5">Responsibilities</p>
              <ul className="space-y-1">
                {job.responsibilities.slice(0, 5).map((r, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{r}</span>
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
