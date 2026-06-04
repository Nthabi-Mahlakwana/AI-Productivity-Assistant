import ReactMarkdown from "react-markdown";
import { Loader2, Copy, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  content: string;
  loading?: boolean;
  error?: string | null;
  placeholder?: string;
}

export function AIOutput({ content, loading, error, placeholder }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm font-medium">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Generating…</span>
            </>
          ) : (
            <span>AI Output</span>
          )}
        </div>
        {content && !loading && (
          <Button size="sm" variant="ghost" onClick={copy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
          </Button>
        )}
      </div>
      <div className="min-h-[280px] px-5 py-4">
        {error ? (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : content ? (
          <div className="prose-chat text-sm">
            <ReactMarkdown>{content}</ReactMarkdown>
            {loading && <span className="inline-block h-3.5 w-1.5 animate-pulse bg-primary align-middle" />}
          </div>
        ) : (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            {placeholder || "AI output will appear here."}
          </div>
        )}
      </div>
      <div className="border-t px-4 py-2 text-[11px] text-muted-foreground">
        ⚠ AI-generated content may require human review.
      </div>
    </div>
  );
}
