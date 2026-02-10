import { FiSearch } from 'react-icons/fi'

const SearchBar = ({ placeholder = 'Search', onChange }) => (
  <div className="relative">
    <FiSearch className="absolute left-3 top-3 text-white/50" />
    <input
      aria-label={placeholder}
      className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-brand-500"
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
    />
  </div>
)

export default SearchBar
