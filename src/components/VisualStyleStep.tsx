import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Camera, Zap, Palette, Box, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { VisualStyle } from "@/types/marketing";

const styles: {
  id: VisualStyle;
  name: string;
  description: string;
  icon: React.ReactNode;
  colors: string;
}[] = [
  {
    id: "photorealistic",
    name: "Studio Photo",
    description: "Clean, high-end product photography",
    icon: <Camera className="w-6 h-6" />,
    colors: "from-slate-400 to-slate-600",
  },
  {
    id: "cyberpunk",
    name: "Neon Cyberpunk",
    description: "Dark backgrounds, glowing neon lights",
    icon: <Zap className="w-6 h-6" />,
    colors: "from-fuchsia-500 to-cyan-400",
  },
  {
    id: "pastel",
    name: "Minimalist Pastel",
    description: "Soft colors, clean negative space",
    icon: <Palette className="w-6 h-6" />,
    colors: "from-pink-300 to-violet-300",
  },
  {
    id: "3d-render",
    name: "3D Render",
    description: "Octane-quality abstract shapes",
    icon: <Box className="w-6 h-6" />,
    colors: "from-orange-400 to-rose-500",
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    description: "Warm, candid, human moments",
    icon: <Heart className="w-6 h-6" />,
    colors: "from-amber-400 to-orange-400",
  },
];

interface VisualStyleStepProps {
  selectedStyle: VisualStyle | null;
  onSelect: (style: VisualStyle) => void;
  onBack: () => void;
  onNext: () => void;
}

const VisualStyleStep = ({ selectedStyle, onSelect, onBack, onNext }: VisualStyleStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Choose your visual direction</h2>
        <p className="text-muted-foreground">
          Select a style that resonates with your brand identity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {styles.map((style, i) => (
          <motion.div
            key={style.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className={`cursor-pointer transition-all hover:scale-[1.02] ${
                selectedStyle === style.id
                  ? "border-primary glow-border"
                  : "glass-surface hover:border-primary/30"
              }`}
              onClick={() => onSelect(style.id)}
            >
              <CardContent className="p-5">
                <div
                  className={`w-full h-24 rounded-lg bg-gradient-to-br ${style.colors} mb-4 flex items-center justify-center opacity-90`}
                >
                  <div className="text-foreground drop-shadow-lg">{style.icon}</div>
                </div>
                <h3 className="font-semibold mb-1">{style.name}</h3>
                <p className="text-xs text-muted-foreground">{style.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedStyle}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
        >
          Open Canvas
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default VisualStyleStep;
