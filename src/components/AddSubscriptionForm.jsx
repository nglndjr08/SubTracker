import { useState, useRef, useEffect } from "react";
import { convertCurrency } from "../utils/format";
import { SERVICES } from "../data/services";

const OWNERS = ["Me", "Mother", "Father", "Brother", "Sister", "Custom"];
const BILLING_CYCLES = ["Monthly", "Quarterly", "Yearly"];

function AddSubscriptionForm({ currency, onAdd }) {
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [price, setPrice] = useState("");
  const [owner, setOwner] = useState("Me");
  const [customOwner, setCustomOwner] = useState("");
  const [plan, setPlan] = useState("");
  const [startDate, setStartDate] = useState("");
  const [billingCycle, setBillingCycle] = useState("Monthly");

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = SERVICES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelectService(service) {
    setSelectedService(service);
    setSearch(service.name);
    setShowDropdown(false);
    setPlan("");
  }

  const availablePlans = selectedService?.plans || [];

  function computeRenewalDate(dateStr, cycle) {
    if (!dateStr) return "";
    const d = new Date(dateStr);

    if (cycle === "Monthly") d.setMonth(d.getMonth() + 1);
    if (cycle === "Quarterly") d.setMonth(d.getMonth() + 3);
    if (cycle === "Yearly") d.setFullYear(d.getFullYear() + 1);

    return d.toISOString().split("T")[0];
  }

  const renewalDate = computeRenewalDate(startDate, billingCycle);

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedService || !price || !startDate) return;

    const newSub = {
      id: Date.now(),
      name: selectedService.name,
      category: selectedService.category,
      plan: plan || null,
      owner: owner === "Custom" ? customOwner : owner,
      price: convertCurrency(Number(price), currency, "USD"),
      billingCycle,
      startDate,
      renewalDate,
      status: "New",
      usage: 3,
    };

    onAdd(newSub);

    setSearch("");
    setSelectedService(null);
    setPrice("");
    setPlan("");
    setStartDate("");
    setBillingCycle("Monthly");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-3 items-end"
    >
      {/* SERVICE */}
      <div className="flex-1 min-w-[220px] relative" ref={dropdownRef}>
        <label className="text-xs text-slate-500 mb-1 block">Service name</label>

        <div className="relative">
          <input
            type="text"
            placeholder="Search a service..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedService(null);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md text-slate-200 text-sm px-3 py-2 pl-8 outline-none"
          />

          <svg
            className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500"
            width="14"
            height="14"
          >
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>

        {showDropdown && search && (
          <div className="absolute top-full mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg max-h-52 overflow-y-auto shadow-lg z-50">
            {filtered.map((s) => (
              <div
                key={s.name}
                onClick={() => handleSelectService(s)}
                className="px-3 py-2 flex justify-between hover:bg-slate-800 cursor-pointer"
              >
                <span className="text-sm text-slate-200">{s.name}</span>
                <span className="text-xs text-slate-500">{s.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PLAN */}
      {availablePlans.length > 0 && (
        <div className="min-w-[140px]">
          <label className="text-xs text-slate-500 mb-1 block">Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md text-slate-300 text-sm px-3 py-2"
          >
            <option value="">Select plan</option>
            {availablePlans.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      {/* PRICE */}
      <div className="min-w-[120px]">
        <label className="text-xs text-slate-500 mb-1 block">Price ({currency})</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-md text-slate-200 text-sm px-3 py-2"
        />
      </div>

      {/* START DATE */}
      <div className="min-w-[150px]">
        <label className="text-xs text-slate-500 mb-1 block">Start date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-md text-slate-200 text-sm px-3 py-2"
        />
      </div>

      {/* BILLING */}
      <div className="min-w-[140px]">
        <label className="text-xs text-slate-500 mb-1 block">Cycle</label>
        <select
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-md text-slate-300 text-sm px-3 py-2"
        >
          {BILLING_CYCLES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* RENEWAL */}
      <div className="min-w-[150px]">
        <label className="text-xs text-slate-500 mb-1 block">Next renewal</label>
        <input
          type="text"
          value={renewalDate || "Auto"}
          readOnly
          className="w-full bg-slate-950 border border-slate-800 rounded-md text-green-400 text-sm px-3 py-2"
        />
      </div>

      {/* OWNER */}
      <div className="min-w-[130px]">
        <label className="text-xs text-slate-500 mb-1 block">Owner</label>
        <select
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-md text-slate-300 text-sm px-3 py-2"
        >
          {OWNERS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        className={`px-5 py-2 rounded-md text-sm font-semibold transition 
        ${
          selectedService && price && startDate
            ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
            : "bg-slate-800 text-slate-500 cursor-not-allowed"
        }`}
      >
        Add
      </button>
    </form>
  );
}

export default AddSubscriptionForm;