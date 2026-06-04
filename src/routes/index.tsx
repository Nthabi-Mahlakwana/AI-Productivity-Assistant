import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Automate emails, meetings, planning and research with AI." },
    ],
  }),
  component: Dashboard,
});

const features = [
  { url: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft professional emails by tone and audience." },
  { url: "/notes", icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn raw notes into summaries, decisions, action items." },
  { url: "/tasks", icon: ListChecks, title: "AI Task Planner", desc: "Prioritize and time-block your day intelligently." },
  { url: "/research", icon: Search, title: "AI Research Assistant", desc: "Structured insights, context, and next steps." },
  { url: "/chat", icon: MessageSquare, title: "AI Chatbot", desc: "Ask anything — your always-on work co-pilot." },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <div
        className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-primary-foreground shadow-[var(--shadow-elegant)]"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider opacity-90">
          <Sparkles className="h-4 w-4" /> Productivity, supercharged
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Your AI workplace assistant
        </h1>
        <p className="mt-2 max-w-xl text-sm opacity-90 md:text-base">
          Automate daily work — emails, meeting notes, planning, and research — all in one clean,
          professional workspace.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.url}
            to={f.url}
            className="group rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
              Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        ⚠ AI-generated content may require human review.
      </p>
    </div>
  );
}
