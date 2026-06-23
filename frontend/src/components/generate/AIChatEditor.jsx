import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  "Make it shorter",
  "Make it longer",
  "More confident",
  "More professional",
  "Add my hackathon achievement",
  "Improve grammar",
  "Make it more human-like",
  "Stronger CTA",
];

export function AIChatEditor({ onSendMessage, isLoading, chatHistory = [] }) {
  const [message, setMessage] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = () => {
    if (!message.trim() || isLoading) return;
    onSendMessage(message.trim());
    setMessage("");
    setShowQuickActions(false);
  };

  const handleQuickAction = (action) => {
    onSendMessage(action);
    setShowQuickActions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold">AI Email Editor</span>
      </div>

      {/* Chat messages */}
      <div className="max-h-[200px] overflow-y-auto p-3 space-y-2">
        {chatHistory.length === 0 && showQuickActions && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              Tell the AI how to modify your email
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                  className="text-[10px] px-2.5 py-1 rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] px-3 py-2 rounded-xl text-xs",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-accent text-foreground rounded-bl-sm"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-accent px-3 py-2 rounded-xl rounded-bl-sm">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t border-border/30">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Make this shorter, mention my React project..."
            disabled={isLoading}
            className="flex-1 bg-accent/50 rounded-lg px-3 py-2 text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="h-8 w-8 rounded-lg shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
