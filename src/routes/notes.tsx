import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FeatureRunner } from "@/components/FeatureRunner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/notes")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer" }] }),
  component: NotesPage,
});

function NotesPage() {
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Extract key points, decisions, action items, and deadlines."
      />
      <FeatureRunner
        feature="notes"
        placeholder="Summary, decisions, and action items will appear here."
        buildInput={() => {
          const notes = ref.current?.value.trim();
          if (!notes) { toast.error("Please paste meeting notes."); return null; }
          return { notes };
        }}
      >
        <div className="space-y-2">
          <Label>Raw Meeting Notes / Transcript</Label>
          <Textarea ref={ref} rows={14} placeholder="Paste your meeting notes here…" />
        </div>
      </FeatureRunner>
    </div>
  );
}
