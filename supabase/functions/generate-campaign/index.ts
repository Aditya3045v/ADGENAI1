import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1";
const TEXT_MODEL = "google/gemini-2.5-flash-preview";
const IMAGE_MODEL = "openai/dall-e-3";

interface CampaignRequest {
  brandName: string;
  industry: string;
  theme: string;
  headlineText: string;
  visualStyle: string;
  brandColor: string;
  productImageBase64?: string;
  productImageMimeType?: string;
}

/** Shared helper to call OpenRouter and handle common errors */
async function callOpenRouter(
  apiKey: string,
  body: Record<string, unknown>
): Promise<Response> {
  const resp = await fetch(`${OPENROUTER_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://lovable.dev",
      "X-Title": "Ad Generator",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errBody = await resp.text();
    console.error(`OpenRouter error [${resp.status}]:`, errBody);

    if (resp.status === 429) {
      throw Object.assign(new Error("Rate limit exceeded. Please try again shortly."), { status: 429 });
    }
    if (resp.status === 402) {
      throw Object.assign(new Error("API credits exhausted. Please add credits."), { status: 402 });
    }
    throw Object.assign(new Error(`OpenRouter API error: ${resp.status}`), { status: 500 });
  }

  return resp;
}

/** Generate image using OpenRouter's DALL-E 3 */
async function generateImage(
  apiKey: string,
  prompt: string
): Promise<string> {
  const resp = await fetch(`${OPENROUTER_URL}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://lovable.dev",
      "X-Title": "Ad Generator",
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      response_format: "url",
    }),
  });

  if (!resp.ok) {
    const errBody = await resp.text();
    console.error(`OpenRouter image error [${resp.status}]:`, errBody);

    if (resp.status === 429) {
      throw Object.assign(new Error("Rate limit exceeded. Please try again shortly."), { status: 429 });
    }
    if (resp.status === 402) {
      throw Object.assign(new Error("API credits exhausted. Please add credits."), { status: 402 });
    }
    throw Object.assign(new Error(`OpenRouter image API error: ${resp.status}`), { status: 500 });
  }

  const data = await resp.json();
  const imageUrl = data.data?.[0]?.url;
  
  if (!imageUrl) {
    throw new Error("No image was generated. Please try again.");
  }
  
  return imageUrl;
}

/** Build an error Response with CORS */
function errorResponse(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const {
      brandName,
      industry,
      theme,
      headlineText,
      visualStyle,
      brandColor,
      productImageBase64,
      productImageMimeType,
    }: CampaignRequest = await req.json();

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not configured");

    // ============================
    // STEP 1: Analyze product image (if provided)
    // ============================
    let productContext = "";

    if (productImageBase64 && productImageMimeType) {
      console.log("Step 1: Analyzing product image with vision...");

      const visionResp = await callOpenRouter(OPENROUTER_API_KEY, {
        model: TEXT_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are an expert product analyst. Analyze this product image in detail. Describe the product, its colors, textures, materials, shape, and any notable features. Be specific and vivid so a text-to-image AI can recreate this product accurately in a new scene. Keep your description to 3-4 sentences.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${productImageMimeType};base64,${productImageBase64}`,
                },
              },
            ],
          },
        ],
      });

      const visionData = await visionResp.json();
      productContext = visionData.choices?.[0]?.message?.content || "";
      console.log("Product context:", productContext);
    }

    // ============================
    // STEP 2: Engineer image generation prompt
    // ============================
    console.log("Step 2: Engineering image generation prompt...");

    const styleDescriptions: Record<string, string> = {
      Photorealistic:
        "photorealistic product photography, studio lighting, dramatic shadows, crisp focus, commercial advertising quality",
      Neon: "neon lights, dark moody atmosphere, vibrant glowing colors, cyberpunk-inspired, electric accents, futuristic vibe",
      Pastel:
        "soft pastel colors, minimalist, clean, gentle gradients, calming aesthetic, airy whitespace",
      Luxury:
        "luxury, gold accents, rich textures, premium feel, elegant composition, dark tones, velvet-like depth",
    };

    const styleDesc =
      styleDescriptions[visualStyle] || styleDescriptions.Photorealistic;

    const productSection = productContext
      ? `\n\nIMPORTANT PRODUCT CONTEXT (from analyzing the uploaded product photo):\n${productContext}\nYou MUST incorporate this exact product into the scene as the hero element. The product should be large, centered or slightly off-center, and dominate the composition.`
      : "";

    const promptEngineerMessages = [
      {
        role: "system",
        content: `You are a world-class Graphic Designer who creates award-winning marketing flyers and posters. Your task: write ONE detailed prompt for an AI image generator to produce a stunning promotional flyer.

MANDATORY DESIGN RULES:
1. TYPOGRAPHY IS KING:
   - The headline "${headlineText}" MUST be the dominant visual — rendered in MASSIVE, ultra-bold display typography (at least 40% of the composition)
   - Use dramatic font treatments: 3D extrusion, metallic finishes, neon glow, gradient fills, or embossed effects
   - Brand name "${brandName}" appears smaller but styled consistently
   - ALL text must be spelled EXACTLY as provided

2. PRODUCT AS HERO:
   - The product is the second focal point, positioned prominently (floating, angled dynamically, or on a pedestal)
   - Lit with cinematic studio lighting — sharp highlights, controlled shadows, rim lighting for depth
   - Product should feel tangible and premium

3. BACKGROUND & ATMOSPHERE:
   - Rich, layered background — NOT flat or plain. Use: gradient meshes, textured surfaces (velvet, concrete, brushed metal), atmospheric fog, bokeh, or environmental context
   - Brand color ${brandColor} woven throughout as accent: in lighting, gradients, decorative elements, and typography highlights

4. LAYOUT & COMPOSITION:
   - Professional graphic design layout with clear Z-pattern or F-pattern visual flow
   - Add design accents: geometric shapes, diagonal slashes, circular offer badges, thin rule lines, floating particles or confetti
   - Strong contrast between foreground elements and background
   - Include a promotional badge/sticker element (e.g., "LIMITED TIME", percentage off, etc.)

5. STYLE: ${styleDesc}
6. THEME: ${theme}-themed for ${industry}

OUTPUT RULES:
- Output ONLY the prompt text — no explanations, no prefixes
- Describe the final design as if photographing an existing poster
- Under 200 words
- Do NOT use words like "generate" or "create"`,
      },
      {
        role: "user",
        content: `Brand: ${brandName}
Industry: ${industry}
Theme: ${theme}
Headline: "${headlineText}"
Style: ${visualStyle}
Color: ${brandColor}${productSection}

Write the flyer design prompt.`,
      },
    ];

    const promptResp = await callOpenRouter(OPENROUTER_API_KEY, {
      model: TEXT_MODEL,
      messages: promptEngineerMessages,
    });

    const promptData = await promptResp.json();
    const imagenPrompt =
      promptData.choices?.[0]?.message?.content?.trim() || "";
    console.log("Engineered prompt:", imagenPrompt);

    if (!imagenPrompt) throw new Error("Failed to generate image prompt");

    // ============================
    // STEP 3: Generate image with OpenRouter DALL-E 3
    // ============================
    console.log("Step 3: Generating image with OpenRouter DALL-E 3...");

    const finalPrompt = `Design a premium 1080x1080 square promotional flyer. This must look like a polished, print-ready marketing poster with bold typography, dramatic product placement, and professional graphic design composition. Every element should feel intentional and high-end.\n\n${imagenPrompt}`;
    
    const imageUrl = await generateImage(OPENROUTER_API_KEY, finalPrompt);

    console.log("Image generated successfully");

    // ============================
    // STEP 4: Generate matching caption
    // ============================
    console.log("Step 4: Generating social media caption...");

    let caption = "";
    try {
      const captionResp = await callOpenRouter(OPENROUTER_API_KEY, {
        model: TEXT_MODEL,
        messages: [
          {
            role: "system",
            content: `You write punchy social media captions. Rules:
- Maximum 2 short sentences (under 25 words total)
- End with 2-3 hashtags
- Include one emoji
- Be bold and direct — no filler words
- Output ONLY the caption, nothing else.`,
          },
          {
            role: "user",
            content: `Brand: ${brandName} | Theme: ${theme} | Headline: "${headlineText}"

Write a short, punchy caption.`,
          },
        ],
      });

      const captionData = await captionResp.json();
      caption = captionData.choices?.[0]?.message?.content?.trim() || "";
    } catch (captionErr) {
      console.warn("Caption generation failed, continuing without caption:", captionErr);
    }

    console.log("Campaign generation complete!");

    return new Response(
      JSON.stringify({
        imageUrl,
        caption,
        prompt: imagenPrompt,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e: any) {
    console.error("generate-campaign error:", e);
    const status = e?.status || 500;
    const message = e instanceof Error ? e.message : "Unknown error";
    return errorResponse(message, status);
  }
});
