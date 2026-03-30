function HeaderControls({
  currency,
  setCurrency,
  selectedCategory,
  setSelectedCategory,
  categories,
  currencies,
  formOpen,
  setFormOpen,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="cursor-pointer rounded-[10px] border border-slate-800 bg-slate-900 px-3 py-[7px] text-[0.82rem] text-slate-400 outline-none"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat === "All" ? "All Categories" : cat}
          </option>
        ))}
      </select>

      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="cursor-pointer rounded-[10px] border border-slate-800 bg-slate-900 px-3 py-[7px] text-[0.82rem] text-slate-400 outline-none"
      >
        {currencies.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => setFormOpen((v) => !v)}
        className={`flex items-center gap-1 rounded-[10px] px-4 py-[7px] text-[0.82rem] font-semibold text-white transition ${
          formOpen
            ? "bg-slate-800"
            : "bg-gradient-to-br from-orange-400 to-rose-500"
        }`}
      >
        <span className="text-[1.1rem] leading-none">
          {formOpen ? "✕" : "+"}
        </span>
        {formOpen ? "Cancel" : "Add Subscription"}
      </button>
    </div>
  );
}

export default HeaderControls;