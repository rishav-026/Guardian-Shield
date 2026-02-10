const FilterPanel = ({ filters, setFilters }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white">
      <div>
        <label className="text-xs text-white/60">Date from</label>
        <input type="date" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" value={filters.from || ''} onChange={(e) => update('from', e.target.value)} />
      </div>
      <div>
        <label className="text-xs text-white/60">Date to</label>
        <input type="date" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" value={filters.to || ''} onChange={(e) => update('to', e.target.value)} />
      </div>
      <div>
        <label className="text-xs text-white/60">Decision</label>
        <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" value={filters.decision || 'ALL'} onChange={(e) => update('decision', e.target.value)}>
          <option value="ALL">All</option>
          <option value="SAFE">Safe</option>
          <option value="BLOCKED">Blocked</option>
          <option value="CHALLENGE">Challenge</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-white/60">Min amount</label>
        <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" value={filters.min || ''} onChange={(e) => update('min', e.target.value)} />
      </div>
    </div>
  )}

export default FilterPanel
