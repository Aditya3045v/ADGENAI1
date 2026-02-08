import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { brandName, industry, description, targetAudience } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert marketing copywriter specializing in social media advertising. Generate exactly 3 distinct, high-conversion ad headlines/hooks. Each should be punchy, attention-grabbing, and under 12 words. Return ONLY a JSON array of 3 objects with "headline" and "angle" fields. The "angle" should be a 5-word max description of the marketing approach (e.g. "Emotional appeal", "Urgency driven", "Social proof"). No markdown, no explanation, just the JSON array.`
          },
          {
            role: "user",
            content: `Brand: ${brandName}\nIndustry: ${industry}\nProduct/Service: ${description}\nTarget Audience: ${targetAudience}\n\nGenerate 3 unique ad headlines.`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    
    // Parse JSON from the response, handling potential markdown wrapping
    let headlines;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      headlines = JSON.parse(cleaned);
    } catch {
      headlines = [
        { headline: `${brandName}: Redefine Your ${industry} Experience`, angle: "Brand positioning" },
        { headline: `Why Smart ${targetAudience} Choose ${brandName}`, angle: "Social proof" },
        { headline: `Transform Your Life with ${brandName} Today`, angle: "Urgency driven" },
      ];
    }

    return new Response(JSON.stringify({ headlines }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-headlines error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
