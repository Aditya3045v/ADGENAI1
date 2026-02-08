import { motion } from "framer-motion";
import { Building2, Users, FileText, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ImageUpload";
import type { BrandContext } from "@/types/marketing";

const industries = [
  "Technology",
  "E-commerce",
  "Health & Wellness",
  "Food & Beverage",
  "Fashion & Apparel",
  "Finance & Fintech",
  "Education",
  "Real Estate",
  "Travel & Hospitality",
  "Entertainment",
  "SaaS",
  "Automotive",
  "Beauty & Cosmetics",
  "Fitness & Sports",
  "Other",
];

interface BrandContextStepProps {
  data: BrandContext;
  onChange: (data: BrandContext) => void;
  onNext: () => void;
}

const BrandContextStep = ({ data, onChange, onNext }: BrandContextStepProps) => {
  const isValid =
    data.brandName.trim() &&
    data.industry &&
    data.description.trim() &&
    data.targetAudience.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Tell us about your brand</h2>
        <p className="text-muted-foreground">
          We'll use this to craft perfectly targeted ad copy and visuals.
        </p>
      </div>

      <Card className="glass-surface">
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="w-4 h-4 text-primary" />
                Brand Name
              </Label>
              <Input
                placeholder="e.g. Acme Co"
                value={data.brandName}
                onChange={(e) =>
                  onChange({ ...data, brandName: e.target.value })
                }
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Briefcase className="w-4 h-4 text-primary" />
                Industry
              </Label>
              <Select
                value={data.industry}
                onValueChange={(v) => onChange({ ...data, industry: v })}
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <FileText className="w-4 h-4 text-primary" />
              Product / Service Description
            </Label>
            <Textarea
              placeholder="Describe what you offer and what makes it unique..."
              value={data.description}
              onChange={(e) =>
                onChange({ ...data, description: e.target.value })
              }
              rows={3}
              className="bg-secondary/50 border-border/50 focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Users className="w-4 h-4 text-primary" />
              Target Audience
            </Label>
            <Input
              placeholder="e.g. Health-conscious millennials aged 25-35"
              value={data.targetAudience}
              onChange={(e) =>
                onChange({ ...data, targetAudience: e.target.value })
              }
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>

          {/* Image Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <ImageUpload
              label="Brand Logo"
              sublabel="Optional · Used in ad design"
              imageUrl={data.logoUrl}
              onUpload={(url) => onChange({ ...data, logoUrl: url })}
              onRemove={() => onChange({ ...data, logoUrl: null })}
            />
            <ImageUpload
              label="Product Image"
              sublabel="Optional · AI will use as reference"
              imageUrl={data.productImageUrl}
              onUpload={(url) => onChange({ ...data, productImageUrl: url })}
              onRemove={() => onChange({ ...data, productImageUrl: null })}
            />
          </div>

          <Button
            onClick={onNext}
            disabled={!isValid}
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
          >
            Continue to Strategy →
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BrandContextStep;
