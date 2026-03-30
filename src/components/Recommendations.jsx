import { useState } from "react";
import { formatCurrency, convertCurrency } from "../utils/format";

const ICONS = {
  cancel: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  alert: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6v3M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  downgrade: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function Recommendations({ recommendations, currency }) {
  const [dismissed, setDismissed] = useState(new Set());
  const [expanded, setExpanded] = useState(null);

  const visible = recommendations.filter((r) => !dismissed.has(r.id));
  const totalSavings = visible
    .filter((r) => r.type === "cancel" && r.savings)
    .reduce((sum, r) => sum + convertCurrency(r.savings, "USD", currency), 0);

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="m-0 font-['DM_Sans','Inter',sans-serif] text-[1.05rem] font-semibold tracking-[-0.01em] text-slate-100">
            Smart Recommendations
          </h2>

          {totalSavings > 0 && (
            <p className="mt-1 text-[0.78rem] font-medium text-emerald-400">
              Up to {formatCurrency(totalSavings, currency)}/mo in savings
            </p>
          )}
        </div>

        <span className="rounded-full bg-orange-400/15 px-2.5 py-[2px] text-[0.72rem] font-semibold tracking-[0.04em] text-orange-400">
          {visible.length} ACTIVE
        </span>
      </div>

      <div className="flex flex-col gap-[10px]">
        {visible.length === 0 && (
          <div className="rounded-[14px] border border-dashed border-slate-800 px-4 py-8 text-center text-[0.85rem] text-slate-600">
            All clear — no recommendations right now.
          </div>
        )}

        {visible.map((item) => {
          const convertedSavings = convertCurrency(item.savings || 0, "USD", currency);
          const convertedOldPrice = item.oldPrice
            ? convertCurrency(item.oldPrice, "USD", currency)
            : 0;
          const convertedNewPrice = item.newPrice
            ? convertCurrency(item.newPrice, "USD", currency)
            : 0;

          const isCancel = item.type === "cancel";
          const isAlert = item.type === "alert";
          const isExpanded = expanded === item.id;

          let message = "";
          if (isCancel) {
            message = `You rarely use ${item.subName}. Canceling could save you ${formatCurrency(
              convertedSavings,
              currency
            )} every month.`;
          }
          if (isAlert) {
            message = `${item.subName} went up from ${formatCurrency(
              convertedOldPrice,
              currency
            )} to ${formatCurrency(convertedNewPrice, currency)}.`;
          }

          const containerClasses = isExpanded
            ? isCancel
              ? "border-emerald-400/25 bg-emerald-400/10"
              : isAlert
              ? "border-rose-400/25 bg-rose-400/10"
              : "border-blue-400/25 bg-blue-400/10"
            : "border-slate-800 bg-slate-900";

          const accentBarClasses = isCancel
            ? "bg-emerald-400"
            : isAlert
            ? "bg-rose-400"
            : "bg-blue-400";

          const iconBadgeClasses = isCancel
            ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
            : isAlert
            ? "border border-rose-400/20 bg-rose-400/10 text-rose-400"
            : "border border-blue-400/20 bg-blue-400/10 text-blue-400";

          const pillClasses = isCancel
            ? "bg-emerald-400/10 text-emerald-400"
            : "bg-rose-400/10 text-rose-400";

          return (
            <div
              key={item.id}
              className={`relative cursor-pointer overflow-hidden rounded-[14px] border px-4 py-[14px] transition-all duration-200 ease-in-out ${containerClasses}`}
              onClick={() => setExpanded(isExpanded ? null : item.id)}
            >
              <div
                className={`absolute bottom-0 left-0 top-0 w-[3px] rounded-l-[14px] opacity-80 ${accentBarClasses}`}
              />

              <div className="flex items-start justify-between gap-3 pl-2">
                <div className="flex flex-1 items-start gap-[10px]">
                  <div
                    className={`mt-[1px] flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] ${iconBadgeClasses}`}
                  >
                    {ICONS[item.type] || ICONS.alert}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold leading-[1.3] text-slate-200">
                        {item.title}
                      </span>

                      <span
                        className={`rounded-full px-[7px] py-[2px] text-[0.68rem] font-semibold uppercase tracking-[0.05em] ${pillClasses}`}
                      >
                        {isCancel ? "Save" : "Alert"}
                      </span>
                    </div>

                    <p
                      className={`mt-[5px] overflow-hidden text-[0.8rem] leading-[1.5] text-slate-500 transition-all duration-300 ease-in-out ${
                        isExpanded ? "max-h-[200px]" : "max-h-[38px]"
                      }`}
                    >
                      {message}
                    </p>

                    {isExpanded && (
                      <div
                        className="mt-3 flex flex-wrap gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {isCancel && (
                          <button className="rounded-[8px] border border-emerald-400/30 bg-emerald-400/15 px-[14px] py-[5px] text-[0.78rem] font-semibold text-emerald-400">
                            Cancel subscription
                          </button>
                        )}

                        <button
                          className="rounded-[8px] border border-slate-800 bg-transparent px-[14px] py-[5px] text-[0.78rem] font-medium text-slate-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDismissed((prev) => new Set([...prev, item.id]));
                            setExpanded(null);
                          }}
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-[6px]">
                  {item.savings > 0 && (
                    <span className="text-sm font-bold tracking-[-0.02em] text-emerald-400">
                      -{formatCurrency(convertedSavings, currency)}
                    </span>
                  )}

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className={`text-slate-600 transition-transform duration-200 ease-in-out ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path
                      d="M3 5l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Recommendations;