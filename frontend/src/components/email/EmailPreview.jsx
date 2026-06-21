import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QualityScore } from "./QualityScore";
import { Badge } from "@/components/ui/badge";
export function EmailPreview({
  subject,
  content,
  qualityScore,
  recipientEmail,
  recipientName,
  onSubjectChange,
  onContentChange
}) {
  return /* @__PURE__ */ React.createElement(Card, { className: "overflow-hidden" }, /* @__PURE__ */ React.createElement(CardHeader, { className: "border-b bg-accent/30" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg" }, "Email Preview"), qualityScore !== void 0 && /* @__PURE__ */ React.createElement(QualityScore, { score: qualityScore, size: "sm" }))), /* @__PURE__ */ React.createElement(CardContent, { className: "p-0" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 border-b space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sm" }, /* @__PURE__ */ React.createElement(Badge, { variant: "outline", className: "text-xs" }, "To"), /* @__PURE__ */ React.createElement("span", { className: "text-muted-foreground" }, recipientName ? `${recipientName} <${recipientEmail}>` : recipientEmail)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Badge, { variant: "outline", className: "text-xs" }, "Subject"), /* @__PURE__ */ React.createElement(
    Input,
    {
      value: subject,
      onChange: (e) => onSubjectChange(e.target.value),
      className: "border-0 bg-transparent p-0 h-auto text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0",
      placeholder: "Email subject..."
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement(Label, { className: "text-xs text-muted-foreground mb-2 block" }, "Email Body (editable)"), /* @__PURE__ */ React.createElement(
    Textarea,
    {
      value: content,
      onChange: (e) => onContentChange(e.target.value),
      className: "min-h-[300px] border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 leading-relaxed",
      placeholder: "Email content will appear here..."
    }
  ))));
}
