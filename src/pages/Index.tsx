import { useRef } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustedBy from "@/components/landing/TrustedBy";
import SamplesSection from "@/components/landing/SamplesSection";
import BuilderSection from "@/components/landing/BuilderSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const samplesRef = useRef<HTMLElement>(null);
  const builderRef = useRef<HTMLElement>(null);

  const scrollToSamples = () => {
    samplesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onScrollToBuilder={scrollToBuilder} />
      <HeroSection onScrollToSamples={scrollToSamples} onScrollToBuilder={scrollToBuilder} />
      <TrustedBy />
      <SamplesSection sectionRef={samplesRef} />
      <BuilderSection sectionRef={builderRef} />
      <Footer />
    </div>
  );
};

export default Index;
