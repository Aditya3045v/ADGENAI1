export interface BrandContext {
  brandName: string;
  industry: string;
  description: string;
  targetAudience: string;
  logoUrl: string | null;
  productImageUrl: string | null;
}

export interface Headline {
  headline: string;
  angle: string;
}

export type VisualStyle = 'photorealistic' | 'cyberpunk' | 'pastel' | '3d-render' | 'lifestyle';

export interface VisualStyleOption {
  id: VisualStyle;
  name: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface WizardState {
  step: number;
  brandContext: BrandContext;
  headlines: Headline[];
  selectedHeadline: string;
  selectedStyle: VisualStyle | null;
  generatedImage: string | null;
  isGeneratingHeadlines: boolean;
  isGeneratingImage: boolean;
}
