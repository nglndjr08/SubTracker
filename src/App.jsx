import { useMemo, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useSubscriptions } from "./hooks/useSubscriptions";
import LoginPage from "./components/LoginPage";
import SummaryCards from "./components/SummaryCards";
import SubscriptionList from "./components/SubscriptionList";
import Recommendations from "./components/Recommendations";
import AddSubscriptionForm from "./components/AddSubscriptionForm";
import {
  getMonthlySpend,
  getYearlyProjection,
  getPriceIncreaseCount,
  getRecommendations,
  getPotentialSavings,
} from "./utils/calculations";

const CURRENCIES = [
  { value: "USD", label: "🇺🇸 USD" },
  { value: "PHP", label: "🇵🇭 PHP" },
  { value: "EUR", label: "🇪🇺 EUR" },
  { value: "GBP", label: "🇬🇧 GBP" },
];

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const { subscriptions, loading, addSubscription, deleteSubscription, updateSubscription } =
    useSubscriptions(user?.uid);

  async function handleAddSubscription(newSub) {
    const normalizedSub = {
      ...newSub,
      name: newSub.name || "",
      plan: newSub.plan || "",
      price: Number(newSub.price) || 0,
      category: newSub.category || "Custom",
      usage: Number(newSub.usage) || 0,
      billingCycle: (newSub.billingCycle || "monthly").toLowerCase(),
      status: newSub.status || "New",
      owner: newSub.owner || "Me",
      renewalDate: newSub.renewalDate || "",
      priceHistory: Array.isArray(newSub.priceHistory) ? newSub.priceHistory : [],
    };
    await addSubscription(normalizedSub);
    setFormOpen(false);
  }

  async function handleDelete(id) {
    await deleteSubscription(id);
  }

  async function handleUpdate(updatedSub) {
    await updateSubscription(updatedSub);
  }

  async function handleLogout() {
    await signOut(auth);
  }

  const categories = useMemo(() => {
    return ["All", ...new Set(subscriptions.map((s) => s.category).filter(Boolean))];
  }, [subscriptions]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(
      (s) => selectedCategory === "All" || s.category === selectedCategory
    );
  }, [subscriptions, selectedCategory]);

  const monthlySpend = getMonthlySpend(filteredSubscriptions);
  const yearlyProjection = getYearlyProjection(filteredSubscriptions);
  const priceIncreaseCount = getPriceIncreaseCount(filteredSubscriptions);
  const recommendations = getRecommendations(filteredSubscriptions);
  const potentialSavings = getPotentialSavings(recommendations);

  // Auth loading spinner
  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#020617", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #1e293b", borderTop: "3px solid #fb923c", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not logged in
  if (!user) return <LoginPage />;

  // Subscriptions loading
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#020617", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem" }}>
        Loading your subscriptions...
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1400px] bg-slate-950 px-6 py-7 font-['DM_Sans','Inter',sans-serif] text-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-[10px]">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-orange-400 to-rose-500">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L3 6v6l6 4 6-4V6L9 2Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
              <circle cx="9" cy="9" r="2" fill="white" />
            </svg>
          </div>
          <div>
            <h1 className="m-0 text-[1.25rem] font-bold leading-[1.2] tracking-[-0.03em] text-slate-50">SubTracker</h1>
            <p className="mt-[1px] text-[0.75rem] text-slate-600">Smart subscription management</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="cursor-pointer rounded-[10px] border border-slate-800 bg-slate-900 px-3 py-[7px] text-[0.82rem] text-slate-400 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
            ))}
          </select>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="cursor-pointer rounded-[10px] border border-slate-800 bg-slate-900 px-3 py-[7px] text-[0.82rem] text-slate-400 outline-none"
          >
            {CURRENCIES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>

          <button
            onClick={() => setFormOpen((prev) => !prev)}
            className={`flex items-center gap-1 rounded-[10px] px-4 py-[7px] text-[0.82rem] font-semibold text-white transition ${
              formOpen ? "bg-slate-800" : "bg-gradient-to-br from-orange-400 to-rose-500"
            }`}
          >
            <span className="text-[1.1rem] leading-none">{formOpen ? "✕" : "+"}</span>
            {formOpen ? "Cancel" : "Add Subscription"}
          </button>

          {/* User avatar + sign out */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName}
                title={user.displayName}
                referrerPolicy="no-referrer"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "2px solid #1e293b",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}
            <button
              onClick={handleLogout}
              style={{ background: "transparent", border: "1px solid #1e293b", borderRadius: 8, color: "#64748b", fontSize: "0.78rem", padding: "5px 12px", cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {formOpen && (
        <AddSubscriptionForm currency={currency} onAdd={handleAddSubscription} />
      )}

      <SummaryCards
        monthlySpend={monthlySpend}
        yearlyProjection={yearlyProjection}
        priceIncreaseCount={priceIncreaseCount}
        potentialSavings={potentialSavings}
        currency={currency}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <SubscriptionList
          subscriptions={filteredSubscriptions}
          currency={currency}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
        <Recommendations recommendations={recommendations} currency={currency} />
      </div>
    </main>
  );
}

export default App;