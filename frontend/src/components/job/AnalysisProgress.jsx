import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
const STEPS = [
  { id: 1, label: "Reading and parsing job posting URL", duration: 1500 },
  { id: 2, label: "Extracting metadata & page HTML content", duration: 2e3 },
  { id: 3, label: "Analyzing requirements and responsibilities with AI", duration: 2500 },
  { id: 4, label: "Generating candidate resume match suggestions", duration: 1500 }
];
export const AnalysisProgress = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let stepTimer;
    let progressTimer;
    progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        const increment = prev < 50 ? 2 : prev < 85 ? 1 : 0.2;
        return Math.min(prev + increment, 98);
      });
    }, 100);
    const runSteps = async () => {
      for (const step of STEPS) {
        setCurrentStep(step.id);
        await new Promise((resolve) => {
          stepTimer = setTimeout(resolve, step.duration);
        });
      }
      setProgress(100);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    };
    runSteps();
    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);
  return /* @__PURE__ */ React.createElement("div", { className: "p-6 border border-zinc-800 bg-zinc-950/80 backdrop-blur-md rounded-xl max-w-md mx-auto space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2 text-center" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-zinc-100" }, "AI Job Analysis Agent"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-zinc-400" }, "Extracting job specifications and requirements...")), /* @__PURE__ */ React.createElement(Progress, { value: progress, className: "h-2 bg-zinc-900" }), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, STEPS.map((step) => {
    const isDone = currentStep > step.id || progress === 100;
    const isCurrent = currentStep === step.id && progress < 100;
    return /* @__PURE__ */ React.createElement("div", { key: step.id, className: "flex items-center space-x-3 text-sm" }, isDone ? /* @__PURE__ */ React.createElement(CheckCircle2, { className: "h-5 w-5 text-emerald-500 flex-shrink-0" }) : isCurrent ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-5 w-5 text-zinc-300 animate-spin flex-shrink-0" }) : /* @__PURE__ */ React.createElement(Circle, { className: "h-5 w-5 text-zinc-700 flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: `${isCurrent ? "text-zinc-200 font-medium" : isDone ? "text-zinc-400" : "text-zinc-600"}` }, step.label));
  })));
};
