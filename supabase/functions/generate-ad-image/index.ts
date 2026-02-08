import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { headline, style, brandName, description, logoUrl, productImageUrl } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context about uploaded images
    const imageContext = [];
    if (logoUrl) imageContext.push(`The brand logo is provided - incorporate it naturally into the design.`);
    if (productImageUrl) imageContext.push(`A product image is provided - feature the product prominently in the ad.`);
    const imageContextStr = imageContext.length > 0 ? ` ${imageContext.join(" ")}` : "";

    const stylePrompts: Record<string, string> = {
      photorealistic: `Create a premium social media ad (1:1 square format) in a high-end product photography style. Clean studio background, dramatic lighting, professional commercial look.${imageContextStr} Feature the text "${headline}" prominently in elegant serif typography. Product: ${description} for brand ${brandName}. Ultra high resolution.`,
      cyberpunk: `Create a social media ad (1:1 square format) in a vibrant neon cyberpunk style. Dark moody background with electric blue, pink and purple neon glowing lights, futuristic feel.${imageContextStr} Feature the text "${headline}" in bold glowing neon typography. Brand: ${brandName}. Ultra high resolution.`,
      pastel: `Create a social media ad (1:1 square format) in a minimalist pastel style. Soft blush pink, lavender, and mint colors, lots of negative space, clean geometric shapes.${imageContextStr} Feature the text "${headline}" in modern sans-serif typography. Brand: ${brandName}. Ultra high resolution.`,
      "3d-render": `Create a social media ad (1:1 square format) in a stunning 3D render style. Abstract geometric shapes, octane render quality, glossy materials, dramatic lighting with reflections.${imageContextStr} Feature the text "${headline}" in bold 3D extruded typography. Brand: ${brandName}. Ultra high resolution.`,
      lifestyle: `Create a social media ad (1:1 square format) in a warm lifestyle photography style. People enjoying life, golden hour warm lighting, authentic and relatable.${imageContextStr} Feature the text "${headline}" in friendly modern typography as overlay. Product: ${description} for brand ${brandName}. Ultra high resolution.`,
    };

    const prompt = stylePrompts[style] || stylePrompts.photorealistic;

    // Build message content - include images if provided
    const messageContent: any[] = [{ type: "text", text: prompt }];

    if (productImageUrl) {
      messageContent.push({
        type: "image_url",
        image_url: { url: productImageUrl },
      });
    }

    if (logoUrl) {
      messageContent.push({
        type: "image_url",
        image_url: { url: logoUrl },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: messageContent }],
        modalities: ["image", "text"],
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
      console.error("AI image error:", response.status, t);
      throw new Error("AI image generation failed");
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-ad-image error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
