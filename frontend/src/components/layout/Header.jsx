import { FiSearch, FiPlayCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const Header = ({ onSearch }) => {
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-white/70">GuardianShield Command</p>
        <h1 className="text-2xl font-semibold text-white">Fraud Analytics Dashboard</h1>
      </div>
      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative max-w-md w-full hidden md:block">
          <FiSearch className="absolute left-4 top-3.5 text-white/50" />
          <input
            aria-label="Search"
            placeholder="Search transactions, merchants, users"
            className="w-full rounded-xl bg-white/5 text-white pl-11 pr-4 py-3 border border-white/10 focus:border-brand-500 focus:outline-none"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-500 text-white font-semibold shadow-lg"
          onClick={() => navigate('/demo')}
        >
          <FiPlayCircle />
          Launch Demo Mode
        </button>
      </div>
    </header>
  )
}

export default Header
