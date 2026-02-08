import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HeroSectionProps {
  onScrollToSamples: () => void;
  onScrollToBuilder: () => void;
}

const HLS_URL =
  "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/e923e67d71fed3e0853ec57f0348451e/manifest/video.m3u8";

const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
      hls.loadSource(HLS_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_URL;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
    />
  );
};

const HeroSection = ({ onScrollToSamples, onScrollToBuilder }: HeroSectionProps) => {
  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden pt-20">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HeroVideo />
        {/* Subtle blur + dark overlay — CSS filter on a thin overlay, not on video itself */}
        <div
          className="absolute inset-0 z-[1]"
          style={{ backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
        />
        <div className="absolute inset-0 z-[2] bg-background/75" />
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[800px] z-10 px-6"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-full text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground mb-6">
          <span className="w-1.5 h-1.5 bg-accent-violet rounded-full shadow-[0_0_8px_hsl(258,90%,66%)]" />
          Powered by Gemini 3.0, n8n and NanoBanana
        </div>

        <h1 className="font-heading text-[clamp(40px,6vw,64px)] leading-[1.1] mb-6 font-semibold">
          Create Marketing<br />
          Campaigns <br />
          <span className="text-gradient">That Convert.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-[500px] mx-auto mb-12 font-light">
          An automated ecosystem that transforms product intelligence into high-performance Instagram and WhatsApp campaigns in minutes.
        </p>

        {/* Stats */}
        <div className="flex justify-center items-center gap-8 mb-12">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-heading font-semibold">10x</span>
            <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mt-1">Efficiency</span>
          </div>
          <div className="w-px h-8 bg-[rgba(255,255,255,0.08)]" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-heading font-semibold">95%</span>
            <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mt-1">Engagement</span>
          </div>
          <div className="w-px h-8 bg-[rgba(255,255,255,0.08)]" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-heading font-semibold">5k+</span>
            <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mt-1">Enterprises</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onScrollToBuilder}
            className="bg-foreground text-background py-3 px-8 rounded-full font-semibold text-sm border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.3)]"
          >
            Get Started Free
          </button>
          <button
            onClick={onScrollToSamples}
            className="bg-transparent text-foreground py-3 px-8 rounded-full font-medium text-sm border border-[rgba(255,255,255,0.08)] cursor-pointer inline-flex items-center gap-2 transition-all duration-300 hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.03)]"
          >
            View Showcase
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <div
        onClick={onScrollToSamples}
        className="absolute bottom-10 flex flex-col items-center gap-3 cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
