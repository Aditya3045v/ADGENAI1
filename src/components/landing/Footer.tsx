const footerLinks = {
  Product: [
    { label: "AI Campaign Builder", href: "#" },
    { label: "Image Generation", href: "#" },
    { label: "Headline Writer", href: "#" },
    { label: "Analytics Dashboard", href: "#" },
    { label: "API Access", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press Kit", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Tutorials", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "Community", href: "#" },
    { label: "Support", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "GDPR", href: "#" },
  ],
};

const SocialIcon = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex items-center justify-center w-9 h-9 rounded-full no-underline transition-all duration-200 hover:opacity-80 hover:scale-110"
    style={{ backgroundColor: "rgb(28, 28, 28)" }}
  >
    <div className="w-4 h-4 flex items-center justify-center">{children}</div>
  </a>
);

const Footer = () => {
  return (
    <footer className="w-full pt-24 pb-8 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Top: Giant Brand + Tagline */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
        <h2 className="text-[clamp(72px,14vw,200px)] leading-[0.85em] font-heading font-semibold tracking-tight text-foreground">
          AdGen
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-xs md:max-w-sm leading-relaxed pb-2 md:pb-4">
          Transform product intelligence into high-performance marketing campaigns — powered by AI.
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border mb-12" />

      {/* Middle: Link Columns + Newsletter */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {category}
            </h3>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[rgb(140,140,140)] hover:text-foreground transition-colors duration-200 no-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div className="flex flex-col gap-4 col-span-2 md:col-span-3 lg:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Stay Updated
          </h3>
          <p className="text-sm text-[rgb(100,100,100)] leading-relaxed">
            Get the latest on AI marketing, product updates, and creative insights.
          </p>
          <div className="flex gap-2 mt-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 min-w-0 bg-[rgb(18,18,18)] border border-[rgba(255,255,255,0.08)] rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-[rgb(80,80,80)] outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors duration-200"
            />
            <button className="bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap hover:opacity-90 transition-opacity duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border mb-8" />

      {/* Bottom: Copyright + Socials */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-[rgb(82,82,82)] leading-[1.1em]">
          © 2025 AdGen. All rights reserved.
        </p>

        <div className="flex items-center gap-3">
          {/* Instagram */}
          <SocialIcon href="https://www.instagram.com" label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="rgb(179, 179, 179)" viewBox="0 0 16 16">
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
            </svg>
          </SocialIcon>

          {/* LinkedIn */}
          <SocialIcon href="https://www.linkedin.com" label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
              <circle fill="rgb(179, 179, 179)" cx="4.983" cy="5.009" r="2.188" />
              <path fill="rgb(179, 179, 179)" d="M9.237 8.855v12.139h3.769v-6.003c0-1.584.298-3.118 2.262-3.118 1.937 0 1.961 1.811 1.961 3.218v5.904H21v-6.657c0-3.27-.704-5.783-4.526-5.783-1.835 0-3.065 1.007-3.568 1.96h-.051v-1.66H9.237zm-6.142 0H6.87v12.139H3.095z" />
            </svg>
          </SocialIcon>

          {/* X / Twitter */}
          <SocialIcon href="https://www.x.com" label="X">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="rgb(179, 179, 179)">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </SocialIcon>

          {/* YouTube */}
          <SocialIcon href="https://www.youtube.com" label="YouTube">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="rgb(179, 179, 179)">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </SocialIcon>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
