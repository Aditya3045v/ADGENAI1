import { motion } from "framer-motion";
import { ArrowLeft, Download, Sparkles, Loader2, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BrandContext, VisualStyle } from "@/types/marketing";

interface CanvasStepProps {
  brandContext: BrandContext;
  headline: string;
  style: VisualStyle;
  generatedImage: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
  onBack: () => void;
}

const styleLabels: Record<VisualStyle, string> = {
  photorealistic: "Studio Photo",
  cyberpunk: "Neon Cyberpunk",
  pastel: "Minimalist Pastel",
  "3d-render": "3D Render",
  lifestyle: "Lifestyle",
};

const CanvasStep = ({
  brandContext,
  headline,
  style,
  generatedImage,
  isGenerating,
  onGenerate,
  onBack,
}: CanvasStepProps) => {
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `${brandContext.brandName.replace(/\s+/g, "-")}-ad.png`;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Ad Canvas</h2>
        <p className="text-muted-foreground">Generate and preview your AI-powered ad design.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <Card className="glass-surface">
            <CardContent className="p-5 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Brand</p>
                <p className="font-medium text-sm">{brandContext.brandName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Headline</p>
                <p className="font-medium text-sm">{headline}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Visual Style</p>
                <p className="font-medium text-sm">{styleLabels[style]}</p>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : generatedImage ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Regenerate Design
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Design
              </>
            )}
          </Button>

          {generatedImage && (
            <Button
              variant="outline"
              onClick={handleDownload}
              className="w-full border-border/50 text-foreground hover:bg-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Styles
          </Button>
        </div>

        {/* Canvas Preview */}
        <Card className="glass-surface overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square w-full max-w-[540px] mx-auto bg-secondary/30 flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4 p-8">
                  <div className="relative">
                    <Skeleton className="w-full h-full absolute inset-0 rounded-lg bg-secondary" />
                    <div className="w-64 h-64 flex items-center justify-center relative z-10">
                      <div className="text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">AI is designing your ad...</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">This may take 15-30 seconds</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : generatedImage ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={generatedImage}
                  alt="Generated ad design"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Click "Generate Design" to create your ad
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">1080 × 1080 social media format</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default CanvasStep;
