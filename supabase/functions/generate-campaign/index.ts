import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const TEXT_MODEL = "google/gemini-3-flash-preview";
const IMAGE_MODEL = "google/gemini-3-pro-image-preview";

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

/** Shared helper to call the Lovable AI Gateway and handle common errors */
async function callGateway(
  apiKey: string,
  body: Record<string, unknown>
): Promise<Response> {
  const resp = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errBody = await resp.text();
    console.error(`Gateway error [${resp.status}]:`, errBody);

    if (resp.status === 429) {
      throw Object.assign(new Error("Rate limit exceeded. Please try again shortly."), { status: 429 });
    }
    if (resp.status === 402) {
      throw Object.assign(new Error("AI credits exhausted. Please add credits."), { status: 402 });
    }
    throw Object.assign(new Error(`AI gateway error: ${resp.status}`), { status: 500 });
  }

  return resp;
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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // ============================
    // STEP 1: Analyze product image (if provided)
    // ============================
    let productContext = "";

    if (productImageBase64 && productImageMimeType) {
      console.log("Step 1: Analyzing product image with vision...");

      const visionResp = await callGateway(LOVABLE_API_KEY, {
        model: TEXT_MODEL,
        messages: [
          {
            role: "system",
            content: `You are an elite product photographer and visual analyst. Your analysis will be used by an AI image generator to recreate this product perfectly in a new marketing context.

ANALYSIS FRAMEWORK:
1. PRODUCT IDENTIFICATION: What is this product? Category, type, and purpose.
2. PHYSICAL ATTRIBUTES: Exact colors (use specific color names like "matte charcoal", "rose gold", "arctic white"), materials (glossy plastic, brushed aluminum, soft leather), textures, and surface finishes.
3. FORM & PROPORTIONS: Shape, dimensions relative to each other, distinctive silhouette features.
4. KEY VISUAL ELEMENTS: Logos, labels, unique design features, patterns, hardware, or embellishments.
5. LIGHTING CHARACTERISTICS: How does light interact with the product? Reflective, matte, translucent, metallic sheen?

OUTPUT: A dense, specific 4-5 sentence description optimized for image generation. Use concrete visual language, not marketing speak.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this product image with extreme precision for AI image generation.",
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
      Photorealistic: `ULTRA-REALISTIC COMMERCIAL PHOTOGRAPHY STYLE:
- Shot on Phase One IQ4 150MP medium format camera with Schneider 80mm f/2.8 lens
- Three-point studio lighting: key light with large softbox at 45°, fill light at 1:4 ratio, rim light for product separation
- Perfectly controlled shadows with gradient falloff, subtle ambient occlusion
- 8K resolution quality, razor-sharp product focus with gentle depth of field on background
- Color-accurate with professional color grading, neutral but rich tones`,
      
      Neon: `CINEMATIC CYBERPUNK NEON STYLE:
- Deep noir darkness (near-black background with selective illumination)
- Intense saturated neon lighting: electric cyan (#00FFFF), hot magenta (#FF00FF), electric violet (#8B00FF)
- Dramatic light rays, volumetric fog/haze catching neon beams
- Reflective wet surfaces, chrome/mirror accents catching neon reflections
- High contrast with crushed blacks and blown-out neon highlights
- Blade Runner / Tron aesthetic with futuristic tech-noir atmosphere`,
      
      Pastel: `REFINED MINIMALIST PASTEL STYLE:
- Soft, diffused natural lighting with no harsh shadows
- Limited palette: dusty rose (#E8D5D5), sage green (#B4C4AE), powder blue (#B6D0E2), cream (#FFF8E7), blush pink (#F4C2C2)
- Generous negative space (60%+ of composition)
- Subtle paper/canvas texture overlay for organic warmth
- Soft rounded geometric accents, thin elegant lines
- Scandinavian-inspired clean composition, Marie Kondo aesthetic`,
      
      Luxury: `OPULENT HIGH-END LUXURY STYLE:
- Rich, moody lighting with dramatic chiaroscuro (Renaissance-inspired light/shadow)
- Deep blacks, champagne golds (#F7E7CE), rose gold (#B76E79), platinum silver
- Materials: black velvet, Italian marble, polished ebony, liquid gold
- Subtle ambient glow, candlelit warmth with modern precision
- Baroque-inspired decorative flourishes, art deco geometric patterns
- Vogue/Harper's Bazaar editorial quality, aspirational and exclusive`,
    };

    const styleDesc = styleDescriptions[visualStyle] || styleDescriptions.Photorealistic;

    const productSection = productContext
      ? `

HERO PRODUCT (CRITICAL - MUST BE ACCURATE):
${productContext}

PRODUCT PLACEMENT RULES:
- Position as the PRIMARY focal point, occupying 25-35% of the composition
- Place slightly off-center (rule of thirds) for dynamic composition
- Angle the product 15-30° for dimensional interest, not flat/straight-on
- Apply cinematic lighting that matches the style while highlighting product details
- Ensure product colors and details are EXACTLY as described above`
      : "";

    const promptEngineerMessages = [
      {
        role: "system",
        content: `You are a legendary Creative Director at a top-tier advertising agency (Wieden+Kennedy, Droga5 caliber). You've created campaigns for Nike, Apple, and Coca-Cola. Your task: craft ONE masterful prompt for AI image generation that will produce an award-winning promotional visual.

CREATIVE BRIEF:
- Brand: ${brandName}
- Industry: ${industry}
- Campaign Theme: ${theme}
- Hero Headline: "${headlineText}"
- Brand Color: ${brandColor}

VISUAL STYLE SPECIFICATIONS:
${styleDesc}

MANDATORY DESIGN PRINCIPLES:

1. TYPOGRAPHY HIERARCHY (Most Important Element):
   - HEADLINE "${headlineText}" must be MASSIVE and DOMINANT — occupying 30-40% of visual weight
   - Typography treatment: Choose ONE dramatic approach:
     * 3D extruded letters with ${brandColor} lighting and metallic sheen
     * Bold sans-serif with gradient fill from ${brandColor} to complementary color
     * Neon-glow effect with soft bloom and light trails
     * Elegant serif with gold foil / emboss effect for luxury
   - Text must be PERFECTLY LEGIBLE and spelled EXACTLY as provided
   - Brand name "${brandName}" as secondary element, styled consistently but smaller

2. COMPOSITION & LAYOUT:
   - 1:1 square format (Instagram-optimized)
   - Clear visual hierarchy: Headline → Product → Supporting elements
   - Use rule of thirds for product/text placement
   - Strong foreground/background separation with depth layers
   - Dynamic diagonal lines or curves to guide eye movement

3. BACKGROUND & ATMOSPHERE:
   - NEVER flat or solid-color backgrounds
   - Rich environmental context OR abstract gradient with texture
   - Atmospheric depth: subtle fog, bokeh, light particles, or lens flare
   - Brand color ${brandColor} integrated as accent lighting, gradients, or design elements

4. FINISHING TOUCHES:
   - Add ONE promotional element: badge, sticker, or banner with offer text
   - Include subtle design accents: geometric shapes, thin lines, or floating particles
   - Professional color grading that unifies all elements
   - Photorealistic rendering quality, commercial-grade finish

OUTPUT FORMAT:
- Write ONLY the image prompt (no explanations, no prefixes, no markdown)
- Describe the scene as if photographing an existing finished poster
- Maximum 250 words
- Use specific, concrete visual language
- Do NOT use words like "generate", "create", or "AI"`,
      },
      {
        role: "user",
        content: `Design an award-winning promotional flyer for:

BRAND: ${brandName}
INDUSTRY: ${industry}  
THEME: ${theme}
HEADLINE: "${headlineText}"
STYLE: ${visualStyle}
BRAND COLOR: ${brandColor}${productSection}

Write the image generation prompt now.`,
      },
    ];

    const promptResp = await callGateway(LOVABLE_API_KEY, {
      model: TEXT_MODEL,
      messages: promptEngineerMessages,
    });

    const promptData = await promptResp.json();
    const imagenPrompt = promptData.choices?.[0]?.message?.content?.trim() || "";
    console.log("Engineered prompt:", imagenPrompt);

    if (!imagenPrompt) throw new Error("Failed to generate image prompt");

    // ============================
    // STEP 3: Generate image with Gemini 3 Pro Image
    // ============================
    console.log("Step 3: Generating image with Gemini 3 Pro Image...");

    const imageGenerationPrompt = `Create a stunning, professional marketing flyer image.

TECHNICAL SPECIFICATIONS:
- Format: 1080x1080 pixel square (1:1 aspect ratio)
- Quality: Ultra-high resolution, print-ready, commercial advertising grade
- Style: Professional graphic design, polished and premium

CRITICAL REQUIREMENTS:
- All text must be PERFECTLY spelled and highly legible
- The headline "${headlineText}" must be the dominant visual element with dramatic typography
- Professional color grading and lighting
- Clean composition with strong visual hierarchy

DESIGN EXECUTION:
${imagenPrompt}

Render this as a finished, professional marketing poster ready for immediate use in a paid advertising campaign.`;

    const imageResp = await callGateway(LOVABLE_API_KEY, {
      model: IMAGE_MODEL,
      messages: [
        {
          role: "user",
          content: imageGenerationPrompt,
        },
      ],
      modalities: ["image", "text"],
    });

    const imageData = await imageResp.json();
    const imageUrl =
      imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error(
        "Unexpected image response structure:",
        JSON.stringify(imageData).slice(0, 500)
      );
      throw new Error("No image was generated. Please try again.");
    }

    console.log("Image generated successfully (data URL length:", imageUrl.length, ")");

    // ============================
    // STEP 4: Generate matching caption
    // ============================
    console.log("Step 4: Generating social media caption...");

    let caption = "";
    try {
      const captionResp = await callGateway(LOVABLE_API_KEY, {
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
