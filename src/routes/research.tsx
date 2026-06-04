import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FeatureRunner } from "@/components/FeatureRunner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const goalRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8">
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Get structured insights, context, and recommended next steps."
      />
      <FeatureRunner
        feature="research"
        placeholder="Insights and analysis will appear here."
        buildInput={() => {
          if (!topic.trim()) { toast.error("Please enter a topic."); return null; }
          return { topic: topic.trim(), goal: goalRef.current?.value.trim() };
        }}
      >
        <div className="space-y-2">
          <Label>Topic</Label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. AI adoption in mid-market SaaS"
          />
        </div>
        <div className="space-y-2">
          <Label>Goal / Specific Questions (optional)</Label>
          <Textarea
            ref={goalRef}
            rows={8}
            placeholder="What are you trying to learn or decide?"
          />
        </div>
      </FeatureRunner>
    </div>
  );
}
