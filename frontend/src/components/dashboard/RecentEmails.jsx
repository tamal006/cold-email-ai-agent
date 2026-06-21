import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
const statusColors = {
  sent: "success",
  draft: "warning",
  failed: "destructive"
};
export function RecentEmails({ emails }) {
  const navigate = useNavigate();
  return /* @__PURE__ */ React.createElement(Card, { className: "opacity-0 animate-fade-in", style: { animationDelay: "400ms", animationFillMode: "forwards" } }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg" }, "Recent Emails")), /* @__PURE__ */ React.createElement(CardContent, null, emails.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-8 text-muted-foreground" }, /* @__PURE__ */ React.createElement("p", null, "No emails yet. Create your first one!")) : /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, emails.map((email) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: email._id,
      onClick: () => navigate(`/history/${email._id}`),
      className: "flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors duration-200 group"
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0 mr-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium truncate group-hover:text-primary transition-colors" }, email.subject), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground truncate" }, "To: ", email.recipientName || email.recipientEmail)),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 shrink-0" }, /* @__PURE__ */ React.createElement(Badge, { variant: statusColors[email.status] || "default" }, email.status), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-muted-foreground" }, format(new Date(email.createdAt), "MMM d")))
  )))));
}
