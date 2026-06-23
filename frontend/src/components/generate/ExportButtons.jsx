import { Copy, Download, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function ExportButtons({ subject, content, jobTitle, company }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${content}`);
      setCopied(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownloadTxt = () => {
    const text = `Subject: ${subject}\n\n${content}`;
    downloadFile(text, `email-${company || "draft"}.txt`, "text/plain");
    toast.success("Downloaded as TXT");
  };

  const handleDownloadHtml = () => {
    const html = `<!DOCTYPE html>
<html>
<head><title>${subject}</title></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; line-height: 1.6;">
<h2 style="color: #333;">${subject}</h2>
<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
${content.split("\n").map((p) => (p.trim() ? `<p style="margin: 10px 0; color: #444;">${p}</p>` : "")).join("\n")}
<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
<p style="font-size: 12px; color: #999;">Generated for: ${jobTitle || "Job Application"} at ${company || "Company"}</p>
</body>
</html>`;
    downloadFile(html, `email-${company || "draft"}.html`, "text/html");
    toast.success("Downloaded as HTML");
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="h-8 text-xs gap-1.5"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Copy"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadTxt}
        className="h-8 text-xs gap-1.5"
      >
        <Download className="h-3.5 w-3.5" />
        TXT
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadHtml}
        className="h-8 text-xs gap-1.5"
      >
        <FileText className="h-3.5 w-3.5" />
        HTML
      </Button>
    </div>
  );
}
