import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Pencil, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { BrandContext, Headline } from "@/types/marketing";

interface StrategyStepProps {
  brandContext: BrandContext;
  headlines: Headline[];
  selectedHeadline: string;
  isGenerating: boolean;
  onGenerate: () => void;
  onSelect: (headline: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const StrategyStep = ({
  brandContext,
  headlines,
  selectedHeadline,
  isGenerating,
  onGenerate,
  onSelect,
  onBack,
  onNext,
}: StrategyStepProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(selectedHeadline);

  const handleEditConfirm = () => {
    if (editValue.trim()) {
      onSelect(editValue.trim());
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">AI-Powered Strategy</h2>
        <p className="text-muted-foreground">
          Let AI craft compelling headlines for{" "}
          <span className="text-primary font-medium">{brandContext.brandName}</span>
        </p>
      </div>

      {headlines.length === 0 && !isGenerating ? (
        <Card className="glass-surface">
          <CardContent className="p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ready to generate ideas?</h3>
            <p className="text-muted-foreground mb-6 text-sm max-w-md mx-auto">
              Our AI will analyze your brand context and create 3 high-conversion headline options.
            </p>
            <Button
              onClick={onGenerate}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-11"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Ideas
            </Button>
          </CardContent>
        </Card>
      ) : isGenerating ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-surface">
              <CardContent className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2 bg-secondary" />
                <Skeleton className="h-4 w-1/3 bg-secondary" />
              </CardContent>
            </Card>
          ))}
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mt-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            AI is crafting your headlines...
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {headlines.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    selectedHeadline === h.headline
                      ? "border-primary glow-border"
                      : "glass-surface"
                  }`}
                  onClick={() => {
                    onSelect(h.headline);
                    setEditValue(h.headline);
                    setIsEditing(false);
                  }}
                >
                  <CardContent className="p-5 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-lg leading-snug">{h.headline}</p>
                      <span className="text-xs text-muted-foreground mt-1 inline-block px-2 py-0.5 bg-secondary rounded-full">
                        {h.angle}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 transition-colors ${
                        selectedHeadline === h.headline
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {selectedHeadline === h.headline && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-full h-full rounded-full flex items-center justify-center"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {selectedHeadline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="bg-secondary/50 border-border/50"
                    autoFocus
                  />
                  <Button onClick={handleEditConfirm} size="sm" className="bg-primary text-primary-foreground">
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditValue(selectedHeadline);
                    setIsEditing(true);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="w-3 h-3 mr-1.5" />
                  Edit headline
                </Button>
              )}
            </motion.div>
          )}

          <div className="flex gap-3 mt-2">
            <Button
              variant="ghost"
              onClick={onGenerate}
              className="text-muted-foreground hover:text-foreground"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Regenerate
            </Button>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Button>
            <Button
              onClick={onNext}
              disabled={!selectedHeadline}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
            >
              Choose Visual Style
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StrategyStep;
