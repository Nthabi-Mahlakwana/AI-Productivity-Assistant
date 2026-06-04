import { useState } from "react";
import { streamAI } from "@/lib/ai-client";
import { AIOutput } from "./AIOutput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface Props {
  feature: "email" | "notes" | "tasks" | "research";
  buildInput: () => Record<string, unknown> | null;
  buttonLabel?: string;
  placeholder?: string;
  children: React.ReactNode;
}

export function FeatureRunner({ feature, buildInput, buttonLabel = "Generate", placeholder, children }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    const input = buildInput();
    if (!input) return;
    setLoading(true);
    setError(null);
    setContent("");
    try {
      await streamAI({
        feature,
        input,
        onDelta: (c) => setContent((prev) => prev + c),
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
        {children}
        <Button onClick={run} disabled={loading} className="w-full" size="lg">
          <Sparkles className="h-4 w-4" />
          {loading ? "Generating…" : buttonLabel}
        </Button>
      </div>
      <AIOutput content={content} loading={loading} error={error} placeholder={placeholder} />
    </div>
  );
}
