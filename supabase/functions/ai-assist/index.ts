// Lovable AI gateway for all assistant features
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROMPTS: Record<string, (i: any) => { system: string; user: string }> = {
  email: (i) => ({
    system:
      "You are an expert professional email writer. Produce a polished, ready-to-send email. Match the requested tone and audience precisely. Use clear subject line, greeting, concise body with structure, and a professional sign-off. Avoid filler.",
    user: `Write an email.\n\nAudience: ${i.audience}\nTone: ${i.tone}\nPurpose / Context:\n${i.context}\n\nFormat:\nSubject: <subject>\n\n<email body>`,
  }),
  notes: (i) => ({
    system:
      "You are an expert meeting analyst. Extract structure from raw meeting notes or transcripts. Be concise, accurate, neutral. Never invent attendees, deadlines, or owners not present in source.",
    user: `Analyze these meeting notes and return Markdown with sections:\n## Summary (3-5 sentences)\n## Key Discussion Points (bullets)\n## Decisions Made\n## Action Items (table: Owner | Task | Deadline)\n## Open Questions\n\nNotes:\n${i.notes}`,
  }),
  tasks: (i) => ({
    system:
      "You are an elite executive productivity coach. Prioritize using the Eisenhower matrix and time-blocking principles. Be realistic about effort.",
    user: `Given my tasks and context, produce a prioritized plan in Markdown:\n## Top Priorities (P1)\n## Important but Not Urgent (P2)\n## Delegate or Defer (P3)\n## Suggested Daily Schedule (time-blocked)\n## Rationale (brief)\n\nContext: ${i.context || "general workday"}\nTasks:\n${i.tasks}`,
  }),
  research: (i) => ({
    system:
      "You are a senior research analyst. Provide structured, well-sourced reasoning. Distinguish established facts from interpretation. If uncertain, say so.",
    user: `Research topic: ${i.topic}\nGoal: ${i.goal || "general overview"}\n\nReturn Markdown:\n## Executive Summary\n## Key Insights (bulleted, each with brief explanation)\n## Background & Context\n## Opportunities / Implications\n## Risks & Counterpoints\n## Recommended Next Steps`,
  }),
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { feature, input, messages } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    let payloadMessages;
    if (feature === "chat") {
      payloadMessages = [
        {
          role: "system",
          content:
            "You are an AI Workplace Productivity Assistant. Help with emails, meetings, task planning, research, and general workplace questions. Be concise, friendly, and professional. Use Markdown formatting.",
        },
        ...(messages || []),
      ];
    } else {
      const builder = PROMPTS[feature];
      if (!builder) throw new Error(`Unknown feature: ${feature}`);
      const { system, user } = builder(input || {});
      payloadMessages = [
        { role: "system", content: system },
        { role: "user", content: user },
      ];
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: payloadMessages,
        stream: true,
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429)
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (resp.status === 402)
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(resp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
