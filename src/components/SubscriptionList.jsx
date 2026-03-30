import { useState } from "react";
import { formatCurrency, convertCurrency } from "../utils/format";

const CATEGORY_STYLES = {
  Streaming: {
    badge: "bg-red-500/10 text-rose-400 border border-red-500/20",
    icon: "bg-red-500/10 text-rose-400 border border-red-500/20",
  },
  Music: {
    badge: "bg-green-500/10 text-green-400 border border-green-500/20",
    icon: "bg-green-500/10 text-green-400 border border-green-500/20",
  },
  Productivity: {
    badge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    icon: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  },
  Gaming: {
    badge: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    icon: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  "Cloud Storage": {
    badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    icon: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  },
  "News & Media": {
    badge: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    icon: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  },
  Fitness: {
    badge: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
    icon: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  },
  Custom: {
    badge: "bg-slate-400/10 text-slate-400 border border-slate-400/20",
    icon: "bg-slate-400/10 text-slate-400 border border-slate-400/20",
  },
};

const STATUS_STYLES = {
  Stable: { color: "bg-green-500", text: "text-green-500", label: "Stable" },
  "Price Increase": {
    color: "bg-amber-500",
    text: "text-amber-500",
    label: "Price Up",
  },
  Unused: { color: "bg-rose-400", text: "text-rose-400", label: "Unused" },
  New: { color: "bg-blue-400", text: "text-blue-400", label: "New" },
};

const OWNER_STYLES = {
  Me: "bg-blue-400/10 text-blue-400",
  Mother: "bg-pink-400/10 text-pink-400",
  Father: "bg-emerald-400/10 text-emerald-400",
  Brother: "bg-orange-400/10 text-orange-400",
  Sister: "bg-violet-400/10 text-violet-400",
  default: "bg-slate-400/10 text-slate-400",
};

const USAGE_LABELS = {
  1: { label: "Rarely", color: "#ef4444" },
  2: { label: "Sometimes", color: "#f97316" },
  3: { label: "Occasionally", color: "#f59e0b" },
  4: { label: "Often", color: "#84cc16" },
  5: { label: "Daily", color: "#22c55e" },
};

const OWNERS = ["Me", "Mother", "Father", "Brother", "Sister", "Custom"];

function UsageBar({ usage = 0, onChange }) {
  const pct = (usage / 5) * 100;
  const usageInfo = USAGE_LABELS[usage] || USAGE_LABELS[3];

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[0.72rem] text-slate-600">Usage</span>
        <span style={{ fontSize: "0.7rem", fontWeight: 600, color: usageInfo.color }}>
          {usageInfo.label} ({usage}/5)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="relative h-1 flex-1 cursor-pointer overflow-hidden rounded-full bg-slate-800"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const val = Math.min(5, Math.max(1, Math.round(pct * 5)));
            onChange(val);
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: usageInfo.color }}
          />
        </div>

        <div className="flex gap-[3px]">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: `1.5px solid ${v <= usage ? usageInfo.color : "#1e293b"}`,
                background: v <= usage ? usageInfo.color : "transparent",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.15s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function getDaysUntil(dateStr) {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function EditModal({ sub, currency, onSave, onClose }) {
  const [price, setPrice] = useState(
    parseFloat(convertCurrency(sub.price, "USD", currency).toFixed(2))
  );
  const [usage, setUsage] = useState(sub.usage || 3);
  const [owner, setOwner] = useState(sub.owner || "Me");
  const [customOwner, setCustomOwner] = useState(
    OWNERS.includes(sub.owner) ? "" : sub.owner || ""
  );
  const [renewalDate, setRenewalDate] = useState(sub.renewalDate || "");

  const inputStyle = {
    width: "100%",
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 8,
    color: "#e2e8f0",
    fontSize: "0.85rem",
    padding: "8px 12px",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "0.72rem",
    color: "#475569",
    display: "block",
    marginBottom: 5,
    fontWeight: 500,
  };

  const usageInfo = USAGE_LABELS[usage] || USAGE_LABELS[3];

  function handleSave() {
    const priceInUSD = convertCurrency(Number(price), currency, "USD");

    const updatedSub = {
      ...sub,
      price: priceInUSD,
      usage: Number(usage),
      owner: owner === "Custom" ? customOwner : owner,
      renewalDate,
      priceHistory: (() => {
        const history = Array.isArray(sub.priceHistory) ? sub.priceHistory : [];
        const lastPrice =
          history.length > 0 ? history[history.length - 1].price : null;

        if (lastPrice !== null && priceInUSD !== lastPrice) {
          const now = new Date();
          const month = `${now.getFullYear()}-${String(
            now.getMonth() + 1
          ).padStart(2, "0")}`;
          return [...history, { date: month, price: priceInUSD }];
        }

        return history;
      })(),
    };

    onSave(updatedSub);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "0 16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 18,
          padding: "24px",
          width: "100%",
          maxWidth: 460,
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: 700,
                color: "#f1f5f9",
              }}
            >
              Edit {sub.name}
            </h3>
            <p
              style={{
                margin: "3px 0 0",
                fontSize: "0.72rem",
                color: "#475569",
              }}
            >
              Update price, usage, or renewal date
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#475569",
              cursor: "pointer",
              fontSize: "1.2rem",
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Monthly price ({currency})</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              style={inputStyle}
            />
            {(() => {
              const history = Array.isArray(sub.priceHistory) ? sub.priceHistory : [];
              const lastUSD =
                history.length > 0 ? history[history.length - 1].price : null;
              const currentInCurrency = lastUSD
                ? convertCurrency(lastUSD, "USD", currency)
                : null;

              if (
                currentInCurrency &&
                Math.abs(Number(price) - currentInCurrency) > 0.01
              ) {
                return (
                  <p
                    style={{
                      margin: "5px 0 0",
                      fontSize: "0.7rem",
                      color: "#f59e0b",
                    }}
                  >
                    ⚠ Price changed from{" "}
                    {formatCurrency(currentInCurrency, currency)} — will update
                    price history
                  </p>
                );
              }

              return null;
            })()}
          </div>

          <div>
            <label style={{ ...labelStyle, marginBottom: 10 }}>
              How often do you use it?{" "}
              <span style={{ color: usageInfo.color, fontWeight: 600 }}>
                {usageInfo.label}
              </span>
            </label>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={usage}
                onChange={(e) => setUsage(Number(e.target.value))}
                style={{
                  flex: 1,
                  accentColor: usageInfo.color,
                  cursor: "pointer",
                }}
              />
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: usageInfo.color,
                  minWidth: 32,
                }}
              >
                {usage}/5
              </span>
            </div>

            {usage <= 2 && (
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "0.7rem",
                  color: "#f59e0b",
                }}
              >
                ⚠ Low usage — this will appear in recommendations
              </p>
            )}
          </div>

          <div>
            <label style={labelStyle}>Account owner</label>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              style={{ ...inputStyle, color: "#94a3b8", cursor: "pointer" }}
            >
              {OWNERS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {owner === "Custom" && (
            <div>
              <label style={labelStyle}>Custom name</label>
              <input
                type="text"
                value={customOwner}
                onChange={(e) => setCustomOwner(e.target.value)}
                style={inputStyle}
                placeholder="e.g. Grandma"
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>Renewal date</label>
            <input
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 20,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid #1e293b",
              borderRadius: 8,
              color: "#64748b",
              fontSize: "0.85rem",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            style={{
              background: "linear-gradient(135deg, #fb923c, #f43f5e)",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: "0.85rem",
              fontWeight: 600,
              padding: "8px 20px",
              cursor: "pointer",
            }}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function SubscriptionList({ subscriptions, currency, onDelete, onUpdate }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [editingSub, setEditingSub] = useState(null);

  const filtered = subscriptions
    .filter((s) =>
      `${s.name} ${s.plan || ""}`.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") return b.price - a.price;
      if (sortBy === "usage") return (b.usage || 0) - (a.usage || 0);
      return a.name.localeCompare(b.name);
    });

  function handleUsageChange(sub, newUsage) {
    if (onUpdate) onUpdate({ ...sub, usage: newUsage });
  }

  return (
    <section>
      {editingSub && (
        <EditModal
          sub={editingSub}
          currency={currency}
          onSave={(updated) => {
            if (onUpdate) onUpdate(updated);
            setEditingSub(null);
          }}
          onClose={() => setEditingSub(null)}
        />
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="m-0 font-['DM_Sans',sans-serif] text-[1.05rem] font-semibold tracking-[-0.01em] text-slate-100">
          Your Subscriptions
          <span className="ml-2 inline-block rounded-full bg-slate-400/10 px-2 py-[2px] align-middle text-[0.72rem] font-semibold text-slate-500">
            {filtered.length}
          </span>
        </h2>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="cursor-pointer rounded-lg border border-slate-800 bg-slate-900 px-[10px] py-1 text-[0.78rem] text-slate-400 outline-none"
        >
          <option value="name">Sort: Name</option>
          <option value="price">Sort: Price</option>
          <option value="usage">Sort: Usage</option>
        </select>
      </div>

      <div className="mb-[14px]">
        <div className="relative min-w-[160px] flex-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="absolute left-[10px] top-1/2 -translate-y-1/2 text-slate-600"
          >
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M9.5 9.5L12 12"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscriptions..."
            className="w-full rounded-[10px] border border-slate-800 bg-slate-900 py-[7px] pl-[30px] pr-[10px] text-[0.82rem] text-slate-200 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <div className="rounded-[14px] border border-dashed border-slate-800 p-8 text-center text-[0.85rem] text-slate-600">
            No subscriptions match your search.
          </div>
        )}

        {filtered.map((sub) => {
          const convertedPrice = convertCurrency(sub.price, "USD", currency);
          const catStyle = CATEGORY_STYLES[sub.category] || CATEGORY_STYLES.Custom;
          const statusStyle = STATUS_STYLES[sub.status] || STATUS_STYLES.Stable;
          const ownerStyle = OWNER_STYLES[sub.owner] || OWNER_STYLES.default;
          const daysUntil = sub.renewalDate ? getDaysUntil(sub.renewalDate) : null;
          const renewingSoon = daysUntil !== null && daysUntil <= 7;
          const billingCycle = (sub.billingCycle || "monthly").toLowerCase();
          const cycleLabel =
            billingCycle === "yearly"
              ? "/yr"
              : billingCycle === "quarterly"
              ? "/qtr"
              : "/mo";

          return (
            <div
              key={sub.id}
              className="rounded-[14px] border border-slate-800 bg-slate-900 px-4 py-[14px] transition-colors duration-150 hover:border-slate-700"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] font-mono text-[0.9rem] font-bold ${catStyle.icon}`}
                >
                  {sub.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[0.9rem] font-semibold text-slate-200">
                        {sub.name}
                      </span>

                      {sub.plan && (
                        <span className="whitespace-nowrap rounded-full bg-slate-400/10 px-2 py-[2px] text-[0.68rem] font-semibold text-slate-300">
                          {sub.plan}
                        </span>
                      )}

                      <span
                        className={`whitespace-nowrap rounded-full px-2 py-[2px] text-[0.68rem] font-semibold ${catStyle.badge}`}
                      >
                        {sub.category}
                      </span>

                      {sub.owner && (
                        <span
                          className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-[2px] text-[0.68rem] font-semibold ${ownerStyle}`}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <circle
                              cx="5"
                              cy="3.5"
                              r="2"
                              stroke="currentColor"
                              strokeWidth="1.2"
                            />
                            <path
                              d="M1.5 9c0-1.933 1.567-3 3.5-3s3.5 1.067 3.5 3"
                              stroke="currentColor"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                            />
                          </svg>
                          {sub.owner}
                        </span>
                      )}
                    </div>

                    <span className="shrink-0 text-[0.95rem] font-bold tracking-[-0.02em] text-slate-100">
                      {formatCurrency(convertedPrice, currency)}
                      <span className="ml-[2px] text-[0.7rem] font-normal text-slate-600">
                        {cycleLabel}
                      </span>
                    </span>
                  </div>

                  <div className="mt-[10px]">
                    <UsageBar
                      usage={sub.usage || 0}
                      onChange={(newUsage) => handleUsageChange(sub, newUsage)}
                    />
                  </div>

                  <div className="mt-[10px] flex flex-wrap items-center justify-between gap-[6px]">
                    <div className="flex items-center gap-[6px]">
                      <div
                        className={`h-[6px] w-[6px] shrink-0 rounded-full ${statusStyle.color}`}
                      />
                      <span className={`text-[0.72rem] font-medium ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                    </div>

                    {sub.renewalDate && (
                      <span
                        className={`text-[0.72rem] ${
                          renewingSoon
                            ? "font-semibold text-amber-500"
                            : "font-normal text-slate-600"
                        }`}
                      >
                        {renewingSoon
                          ? `⚡ Renews in ${daysUntil}d`
                          : `Renews ${sub.renewalDate}`}
                      </span>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button
                        onClick={() => setEditingSub(sub)}
                        style={{
                          background: "rgba(96,165,250,0.08)",
                          border: "1px solid rgba(96,165,250,0.2)",
                          borderRadius: 6,
                          color: "#60a5fa",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          padding: "3px 10px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "rgba(96,165,250,0.15)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "rgba(96,165,250,0.08)")
                        }
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M7 1.5l1.5 1.5L3 8.5H1.5V7L7 1.5Z"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Edit
                      </button>

                      {onDelete && (
                        <button
                          onClick={() => onDelete(sub.id)}
                          className="rounded-md bg-transparent px-[6px] py-[2px] text-[0.72rem] text-slate-700 transition-colors hover:text-rose-400"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SubscriptionList;