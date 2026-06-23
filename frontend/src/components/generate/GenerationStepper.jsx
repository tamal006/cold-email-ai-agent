import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

const STEPS = [
  { id: "job", label: "Job Analysis" },
  { id: "resume", label: "Resume Match" },
  { id: "email", label: "Email Generation" },
  { id: "score", label: "Quality Check" },
];

export function GenerationStepper({ currentStep, completedSteps = [] }) {
  return (
    <div className="flex items-center gap-1 w-full">
      {STEPS.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        const isPending = !isCompleted && !isCurrent;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  isCompleted && "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30",
                  isCurrent && "bg-primary/20 text-primary ring-2 ring-primary/40 animate-pulse-glow",
                  isPending && "bg-secondary text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1 font-medium text-center",
                  isCompleted && "text-emerald-400",
                  isCurrent && "text-primary",
                  isPending && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-full min-w-[20px] -mt-4 transition-colors duration-500",
                  isCompleted ? "bg-emerald-500/40" : "bg-border/30"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
