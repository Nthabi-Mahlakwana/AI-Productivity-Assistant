import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FeatureRunner } from "@/components/FeatureRunner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("");
  const ctxRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Compose polished emails tailored to your audience and tone."
      />
      <FeatureRunner
        feature="email"
        placeholder="Your generated email will appear here."
        buildInput={() => {
          const context = ctxRef.current?.value.trim();
          if (!audience.trim() || !context) {
            toast.error("Please fill in audience and context.");
            return null;
          }
          return { tone, audience: audience.trim(), context };
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Professional", "Friendly", "Persuasive", "Apologetic", "Formal", "Casual", "Urgent"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Audience</Label>
            <Input
              placeholder="e.g. Client, Manager, Team"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Context / Purpose</Label>
          <Textarea
            ref={ctxRef}
            placeholder="What is this email about? Include key points to mention."
            rows={6}
          />
        </div>
      </FeatureRunner>
    </div>
  );
}
