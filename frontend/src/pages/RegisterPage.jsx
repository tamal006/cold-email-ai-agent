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
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ React.createElement(AuthLayout, null, /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "lg:hidden flex items-center gap-3 mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Mail, { className: "h-5 w-5 text-primary" })), /* @__PURE__ */ React.createElement("span", { className: "text-2xl font-bold gradient-text" }, "ColdMail AI")), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold" }, "Create an account"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Start sending AI-powered cold emails today")), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "register-name" }, "Full Name"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "register-name",
      type: "text",
      placeholder: "John Doe",
      ...register("name"),
      className: errors.name ? "border-destructive" : ""
    }
  ), errors.name && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-destructive" }, errors.name.message)), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "register-email" }, "Email"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "register-email",
      type: "email",
      placeholder: "name@example.com",
      ...register("email"),
      className: errors.email ? "border-destructive" : ""
    }
  ), errors.email && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-destructive" }, errors.email.message)), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "register-password" }, "Password"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "register-password",
      type: "password",
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      ...register("password"),
      className: errors.password ? "border-destructive" : ""
    }
  ), errors.password && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-destructive" }, errors.password.message)), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "register-confirm" }, "Confirm Password"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "register-confirm",
      type: "password",
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      ...register("confirmPassword"),
      className: errors.confirmPassword ? "border-destructive" : ""
    }
  ), errors.confirmPassword && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-destructive" }, errors.confirmPassword.message)), /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full", size: "lg", disabled: loading }, loading ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }), "Creating account...") : "Create Account")), /* @__PURE__ */ React.createElement("p", { className: "text-center text-sm text-muted-foreground" }, "Already have an account?", " ", /* @__PURE__ */ React.createElement(Link, { to: "/login", className: "text-primary hover:underline font-medium" }, "Sign in"))));
}
