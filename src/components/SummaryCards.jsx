import { formatCurrency, convertCurrency } from "../utils/format";

const CARD_CONFIG = [
  {
    key: "monthly",
    title: "Monthly Spend",
    subtitle: "Recurring monthly cost",
    accent: "text-blue-400",
    accentBg: "bg-blue-400/10 border border-blue-400/20",
    hoverBorder: "hover:border-blue-400/30",
    glow: "from-transparent via-blue-400/40 to-transparent",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2 7h14" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 11h2M10 11h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "yearly",
    title: "Yearly Projection",
    subtitle: "Estimated annual spend",
    accent: "text-violet-400",
    accentBg: "bg-violet-400/10 border border-violet-400/20",
    hoverBorder: "hover:border-violet-400/30",
    glow: "from-transparent via-violet-400/40 to-transparent",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 2v2M12 2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M2 8h14" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="6" cy="12" r="1" fill="currentColor" />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "increases",
    title: "Price Increases",
    subtitle: "Subs with higher prices",
    accent: "text-amber-500",
    accentBg: "bg-amber-500/10 border border-amber-500/20",
    hoverBorder: "hover:border-amber-500/30",
    glow: "from-transparent via-amber-500/40 to-transparent",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 14V5M5 9l4-4 4 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "savings",
    title: "Potential Savings",
    subtitle: "From recommendations",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-400/10 border border-emerald-400/20",
    hoverBorder: "hover:border-emerald-400/30",
    glow: "from-transparent via-emerald-400/40 to-transparent",
    suffix: "/mo",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M9 5v8M7 7h2.5a1.5 1.5 0 0 1 0 3H7M7 10h3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

function SummaryCards({
  monthlySpend,
  yearlyProjection,
  priceIncreaseCount,
  potentialSavings,
  currency,
}) {
  const values = {
    monthly: formatCurrency(convertCurrency(monthlySpend, "USD", currency), currency),
    yearly: formatCurrency(convertCurrency(yearlyProjection, "USD", currency), currency),
    increases: priceIncreaseCount,
    savings: formatCurrency(convertCurrency(potentialSavings, "USD", currency), currency),
  };

  return (
    <section className="mt-7 grid gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
      {CARD_CONFIG.map((card) => (
        <div
          key={card.key}
          className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 px-[18px] py-4 transition-colors duration-150 ${card.hoverBorder}`}
        >
          <div className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r ${card.glow}`} />

          <div
            className={`mb-3 flex h-[34px] w-[34px] items-center justify-center rounded-[9px] ${card.accentBg} ${card.accent}`}
          >
            {card.icon}
          </div>

          <p className="mb-[6px] text-[0.72rem] font-medium uppercase tracking-[0.04em] text-slate-600">
            {card.title}
          </p>

          <div className="flex items-baseline gap-1">
            <span className="text-[1.65rem] font-bold leading-none tracking-[-0.04em] text-slate-100">
              {values[card.key]}
            </span>

            {card.suffix ? (
              <span className="text-[0.78rem] text-slate-600">{card.suffix}</span>
            ) : null}
          </div>

          <p className="mt-[6px] text-[0.72rem] text-slate-700">
            {card.subtitle}
          </p>
        </div>
      ))}
    </section>
  );
}

export default SummaryCards;