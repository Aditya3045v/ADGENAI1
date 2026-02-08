const brands = ["SHOPIFY", "RAZORPAY", "ZOMATO", "NYKAA", "MEESHO"];

const TrustedBy = () => {
  return (
    <div className="py-16 px-6 text-center border-b border-[rgba(255,255,255,0.08)]">
      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-8 opacity-60">
        TRUSTED BY FORWARD THINKING TEAMS
      </p>
      <div className="flex justify-center gap-16 flex-wrap">
        {brands.map((brand) => (
          <span
            key={brand}
            className="font-heading font-bold text-base text-muted-foreground opacity-50"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TrustedBy;
