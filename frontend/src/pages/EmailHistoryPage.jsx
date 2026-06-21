import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { Search, Trash2, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmails } from "@/hooks/useEmails";
const statusColors = {
  sent: "success",
  draft: "warning",
  failed: "destructive"
};
export default function EmailHistoryPage() {
  const navigate = useNavigate();
  const { emails, total, totalPages, loading, fetchEmails, deleteEmail } = useEmails();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  useEffect(() => {
    fetchEmails({
      search: search || void 0,
      status: status === "all" ? void 0 : status,
      page,
      limit: 10
    });
  }, [search, status, page, fetchEmails]);
  const handleDelete = async (id) => {
    try {
      await deleteEmail(id);
      toast.success("Email deleted");
    } catch {
      toast.error("Failed to delete email");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement(Card, { className: "animate-fade-in" }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "history-search",
      placeholder: "Search emails...",
      value: search,
      onChange: (e) => {
        setSearch(e.target.value);
        setPage(1);
      },
      className: "pl-10"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Filter, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement(Select, { value: status, onValueChange: (v) => {
    setStatus(v);
    setPage(1);
  } }, /* @__PURE__ */ React.createElement(SelectTrigger, { id: "history-filter", className: "w-[140px]" }, /* @__PURE__ */ React.createElement(SelectValue, null)), /* @__PURE__ */ React.createElement(SelectContent, null, /* @__PURE__ */ React.createElement(SelectItem, { value: "all" }, "All Status"), /* @__PURE__ */ React.createElement(SelectItem, { value: "sent" }, "Sent"), /* @__PURE__ */ React.createElement(SelectItem, { value: "draft" }, "Draft"), /* @__PURE__ */ React.createElement(SelectItem, { value: "failed" }, "Failed"))))))), /* @__PURE__ */ React.createElement(Card, { className: "animate-fade-in delay-100", style: { animationFillMode: "forwards" } }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", null, "Emails (", total, ")"))), /* @__PURE__ */ React.createElement(CardContent, null, loading ? /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, [...Array(5)].map((_, i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, className: "h-16 rounded-lg" }))) : emails.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-12 text-muted-foreground" }, /* @__PURE__ */ React.createElement("p", { className: "text-lg mb-2" }, "No emails found"), /* @__PURE__ */ React.createElement("p", { className: "text-sm" }, "Create your first email to get started"), /* @__PURE__ */ React.createElement(Button, { className: "mt-4", onClick: () => navigate("/create") }, "Create Email")) : /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, emails.map((email) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: email._id,
      className: "flex items-center justify-between p-4 rounded-lg border hover:bg-accent/30 transition-all duration-200 group"
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0 mr-4 cursor-pointer", onClick: () => navigate(`/history/${email._id}`) }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-1" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium truncate group-hover:text-primary transition-colors" }, email.subject), /* @__PURE__ */ React.createElement(Badge, { variant: statusColors[email.status] || "default", className: "shrink-0" }, email.status)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4 text-xs text-muted-foreground" }, /* @__PURE__ */ React.createElement("span", null, "To: ", email.recipientName || email.recipientEmail), email.companyName && /* @__PURE__ */ React.createElement("span", null, "\u2022 ", email.companyName), /* @__PURE__ */ React.createElement("span", null, "\u2022 ", format(new Date(email.createdAt), "MMM d, yyyy h:mm a")), email.qualityScore !== void 0 && /* @__PURE__ */ React.createElement("span", null, "\u2022 Score: ", email.qualityScore, "/100"))),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" }, /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: "ghost",
        size: "icon",
        onClick: () => navigate(`/history/${email._id}`)
      },
      /* @__PURE__ */ React.createElement(Eye, { className: "h-4 w-4" })
    ), /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: "ghost",
        size: "icon",
        onClick: () => handleDelete(email._id),
        className: "text-destructive hover:text-destructive"
      },
      /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
    ))
  ))), totalPages > 1 && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-2 mt-6" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      size: "sm",
      disabled: page <= 1,
      onClick: () => setPage((p) => p - 1)
    },
    "Previous"
  ), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-muted-foreground" }, "Page ", page, " of ", totalPages), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outline",
      size: "sm",
      disabled: page >= totalPages,
      onClick: () => setPage((p) => p + 1)
    },
    "Next"
  )))));
}
