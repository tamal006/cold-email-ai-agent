import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ React.createElement(AuthLayout, null, /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "lg:hidden flex items-center gap-3 mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Mail, { className: "h-5 w-5 text-primary" })), /* @__PURE__ */ React.createElement("span", { className: "text-2xl font-bold gradient-text" }, "MailCraft AI")), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold" }, "Welcome back"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Sign in to your account to continue")), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "login-email" }, "Email"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "login-email",
      type: "email",
      placeholder: "name@example.com",
      ...register("email"),
      className: errors.email ? "border-destructive" : ""
    }
  ), errors.email && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-destructive" }, errors.email.message)), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "login-password" }, "Password"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "login-password",
      type: "password",
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      ...register("password"),
      className: errors.password ? "border-destructive" : ""
    }
  ), errors.password && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-destructive" }, errors.password.message)), /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full", size: "lg", disabled: loading }, loading ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }), "Signing in...") : "Sign In")), /* @__PURE__ */ React.createElement("p", { className: "text-center text-sm text-muted-foreground" }, "Don't have an account?", " ", /* @__PURE__ */ React.createElement(Link, { to: "/register", className: "text-primary hover:underline font-medium" }, "Create one"))));
}
