import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Shield, FileText, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [defaultSummary, setDefaultSummary] = useState("");

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Profile
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Name</Label>
              <Input value={user?.name || ""} disabled className="bg-accent/30 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Email</Label>
              <Input value={user?.email || ""} disabled className="bg-accent/30 text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Summary */}
      <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Default Personal Summary
          </h2>
          <p className="text-xs text-muted-foreground">
            This summary will be pre-filled when generating emails. You can override it per email.
          </p>
          <Textarea
            value={defaultSummary}
            onChange={(e) => setDefaultSummary(e.target.value)}
            placeholder="e.g., I am a 4th semester CSE student with strong MERN stack experience..."
            rows={3}
            className="bg-accent/30 resize-none text-sm"
          />
          <Button
            size="sm"
            onClick={() => toast.success("Summary saved!")}
          >
            Save Summary
          </Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            {darkMode ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="gap-2"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Security
          </h2>
          <div className="space-y-2">
            <Label className="text-xs">Current Password</Label>
            <Input type="password" placeholder="••••••••" className="bg-accent/30 text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">New Password</Label>
            <Input type="password" placeholder="••••••••" className="bg-accent/30 text-sm" />
          </div>
          <Button size="sm" variant="outline">
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
