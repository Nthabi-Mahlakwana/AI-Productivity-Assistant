const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assist`;

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export interface StreamOptions {
  feature: "email" | "notes" | "tasks" | "research" | "chat";
  input?: Record<string, unknown>;
  messages?: ChatMessage[];
  onDelta: (chunk: string) => void;
  onDone?: () => void;
  signal?: AbortSignal;
}

export async function streamAI(opts: StreamOptions): Promise<void> {
  const { feature, input, messages, onDelta, onDone, signal } = opts;
  const resp = await fetch(AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ feature, input, messages }),
    signal,
  });

  if (!resp.ok || !resp.body) {
    let msg = `Request failed (${resp.status})`;
    try {
      const data = await resp.json();
      if (data.error) msg = data.error;
    } catch {}
    if (resp.status === 429) msg = "Rate limit exceeded. Please wait a moment and try again.";
    if (resp.status === 402) msg = "AI credits exhausted. Add credits in your Lovable workspace.";
    throw new Error(msg);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line || line.startsWith(":")) continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone?.();
}
