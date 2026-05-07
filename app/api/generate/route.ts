import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "AI Content Studio",
  },
});

// Fallback chain: try each model in order until one works
const FREE_MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "tencent/hy3-preview:free",
  "meta-llama/llama-4-scout:free",
  "google/gemma-3-27b-it:free",
  "mistralai/mistral-7b-instruct:free",
  "qwen/qwen3-8b:free",
  "deepseek/deepseek-r1-0528:free",
];

const CONTENT_TYPE_PROMPTS: Record<string, string> = {
  "blog-post":
    "a comprehensive, engaging blog post with proper structure (intro, body sections with H2/H3 headings using markdown, conclusion). Include hooks, transitions, and actionable insights.",
  "social-media":
    "a set of 5 social media posts for different platforms: LinkedIn (professional, long-form), Twitter/X (2 versions: thread opener + standalone tweet), Instagram caption (with hashtags), and Facebook post. Clearly label each.",
  email:
    "a professional email with clear Subject line, greeting, body with clear structure, call-to-action, and sign-off. Format it properly.",
  "product-description":
    "a compelling product description with headline, key features (as bullets), benefits paragraph, and a strong CTA. Make it persuasive and conversion-focused.",
  brainstorm:
    "a detailed brainstorm session with: 3 creative angles/approaches, 10 specific ideas for each angle, potential challenges for top 3 ideas, and next steps. Organize clearly with markdown headers.",
  "press-release":
    "a professional press release with dateline, headline, subheadline, lead paragraph (5 Ws), body paragraphs, a relevant quote, boilerplate, and contact info placeholder. Follow AP style.",
};

const TONE_MAP: Record<string, string> = {
  formal: "formal, authoritative, and professional",
  casual: "casual, friendly, and conversational",
  persuasive: "persuasive, compelling, and action-oriented",
  humorous: "witty, playful, and entertaining while staying informative",
  inspirational: "inspiring, motivational, and emotionally resonant",
  technical: "technical, precise, and detail-oriented for an expert audience",
};

const LENGTH_MAP: Record<string, string> = {
  short: "concise (300-500 words total)",
  medium: "moderate length (600-1000 words)",
  long: "comprehensive (1200-2000 words)",
};

function isRateLimitError(err: unknown): boolean {
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    // OpenAI SDK wraps it in status
    if (e.status === 429) return true;
    // Sometimes it's nested in the error message or code
    if (
      typeof e.message === "string" &&
      (e.message.includes("429") ||
        e.message.toLowerCase().includes("rate limit"))
    )
      return true;
    // OpenRouter may return error body with code 429
    const errorObj = e.error as Record<string, unknown> | undefined;
    if (errorObj?.code === 429) return true;
  }
  return false;
}

export async function POST(req: Request) {
  const { topic, contentType, tone, keywords, length, language } =
    await req.json();

  if (!topic || !contentType) {
    return new Response("Missing required fields", { status: 400 });
  }

  const contentPrompt =
    CONTENT_TYPE_PROMPTS[contentType] || "high-quality content";
  const toneDesc = TONE_MAP[tone] || tone;
  const lengthDesc = LENGTH_MAP[length] || "moderate length";
  const keywordNote = keywords
    ? `\n- Naturally incorporate these keywords: ${keywords}`
    : "";
  const langNote = language === "id" ? "Bahasa Indonesia" : "English";

  const systemPrompt = `You are an expert content strategist and copywriter. You create ${contentPrompt}.
Always use proper markdown formatting for structure. Be creative, specific, and avoid generic filler content.
Write in ${langNote}.`;

  const userPrompt = `Create ${contentPrompt} about: "${topic}"

Requirements:
- Tone: ${toneDesc}
- Length: ${lengthDesc}${keywordNote}
- Make it genuinely useful and engaging, not generic
- Use markdown formatting properly

Start writing immediately without any preamble like "Sure!" or "Here is...".`;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let lastError: unknown = null;

      for (const model of FREE_MODELS) {
        try {
          console.log(`[AI] Trying model: ${model}`);

          const openrouterStream = await client.chat.completions.create({
            model,
            stream: true,
            max_tokens: 2048,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
          });

          // Signal which model is being used (optional, consumed by client)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ _model: model })}\n\n`),
          );

          for await (const chunk of openrouterStream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              const data = JSON.stringify({ text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return; // success — stop trying models
        } catch (err) {
          lastError = err;

          if (isRateLimitError(err)) {
            console.warn(`[AI] 429 on model ${model}, trying next...`);
            // Notify client we're falling back
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ _fallback: model })}\n\n`,
              ),
            );
            continue; // try next model
          }

          // Non-rate-limit error: surface it immediately
          console.error(`[AI] Non-retryable error on model ${model}:`, err);
          const message =
            err instanceof Error ? err.message : "Unknown error occurred";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`),
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }
      }

      // All models exhausted
      console.error("[AI] All models rate-limited. Last error:", lastError);
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            error:
              "All available AI models are currently rate-limited (429). Please wait a moment and try again.",
          })}\n\n`,
        ),
      );
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
