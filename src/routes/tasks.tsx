import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FeatureRunner } from "@/components/FeatureRunner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [context, setContext] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Prioritize tasks and build a time-blocked schedule."
      />
      <FeatureRunner
        feature="tasks"
        placeholder="Prioritized plan and daily schedule will appear here."
        buildInput={() => {
          const tasks = ref.current?.value.trim();
          if (!tasks) { toast.error("Please enter your tasks."); return null; }
          return { tasks, context };
        }}
      >
        <div className="space-y-2">
          <Label>Context (optional)</Label>
          <Input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Wed, deep work morning, 2 meetings PM"
          />
        </div>
        <div className="space-y-2">
          <Label>Your tasks (one per line)</Label>
          <Textarea
            ref={ref}
            rows={12}
            placeholder={"Finish Q3 report\nReview design feedback\nReply to client RFP\n..."}
          />
        </div>
      </FeatureRunner>
    </div>
  );
}
