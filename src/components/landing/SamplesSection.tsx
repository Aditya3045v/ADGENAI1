import { motion } from "framer-motion";
import sampleCrocs from "@/assets/sample-crocs.jpeg";
import sampleBurger from "@/assets/sample-burger.jpeg";
import sampleWinter from "@/assets/sample-winter.jpeg";

const samples = [
  {
    image: sampleCrocs,
    handle: "@crocs",
    ctr: "4.8% CTR",
    category: "Fashion",
    title: "Crocs Brand Campaign",
    description: "Monochrome product showcase, premium feel.",
    likes: "15.2k",
    shares: "3.4k",
  },
  {
    image: sampleBurger,
    handle: "@burger_house",
    ctr: "5.1% CTR",
    category: "Food",
    title: "Burger Promo Ad",
    description: "Bold typography, vibrant food photography.",
    likes: "12.4k",
    shares: "2.1k",
  },
  {
    image: sampleWinter,
    handle: "@digitalsulaha",
    ctr: "3.9% CTR",
    category: "Fashion",
    title: "Winter Sale Campaign",
    description: "Dramatic icy theme, clear CTA placement.",
    likes: "8.5k",
    shares: "1.2k",
  },
];

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

interface SamplesSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const SamplesSection = ({ sectionRef }: SamplesSectionProps) => {
  return (
    <section
      ref={sectionRef}
      className="py-24 px-6"
      style={{
        background: "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05), transparent 40%)",
      }}
    >
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-full text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground mb-6">
          Inspiration
        </div>
        <h2 className="font-heading text-[40px] font-semibold mb-4">See What's Possible</h2>
        <p className="text-muted-foreground">Generated in seconds, ready for launch.</p>
      </div>

      {/* Cards Grid */}
      <div className="flex justify-center gap-8 flex-wrap max-w-[1200px] mx-auto">
        {samples.map((sample, i) => (
          <motion.div
            key={sample.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-[300px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[rgba(255,255,255,0.15)] group"
          >
            {/* Image Area */}
            <div className="h-[380px] relative overflow-hidden">
              <img
                src={sample.image}
                alt={sample.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-[rgba(0,0,0,0.4)] backdrop-blur-lg px-3 py-1.5 rounded-full text-xs font-medium">
                <InstagramIcon />
                <span>{sample.handle}</span>
              </div>
              <div className="absolute top-4 right-4 bg-[rgba(255,255,255,0.9)] text-[#05050A] px-2.5 py-1 rounded-full text-[11px] font-bold">
                {sample.ctr}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5">
              <div className="text-[10px] uppercase text-accent-blue mb-2 font-semibold tracking-[0.05em]">
                {sample.category}
              </div>
              <h3 className="font-heading text-lg font-semibold mb-1">{sample.title}</h3>
              <p className="text-[13px] text-muted-foreground mb-4">{sample.description}</p>
              <div className="flex gap-4 text-[13px] opacity-80">
                <span>❤️ {sample.likes}</span>
                <span>↗️ {sample.shares}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SamplesSection;
