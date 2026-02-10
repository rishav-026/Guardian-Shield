import { NavLink, useNavigate } from 'react-router-dom'
import { FiHome, FiTrendingUp, FiDatabase, FiShield, FiSettings, FiClock } from 'react-icons/fi'

const links = [
  { to: '/', label: 'Dashboard', icon: FiHome },
  { to: '/analytics', label: 'Analytics', icon: FiTrendingUp },
  { to: '/transactions', label: 'Transactions', icon: FiClock },
  { to: '/merchants', label: 'Merchants', icon: FiDatabase },
  { to: '/settings', label: 'Settings', icon: FiSettings },
]

const Sidebar = () => {
  const navigate = useNavigate()

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 p-5 space-y-6 rounded-2xl navy-gradient h-[calc(100vh-48px)] sticky top-6 text-white shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-white/10 grid place-items-center text-white font-bold">
          <FiShield size={20} />
        </div>
        <div>
          <p className="text-sm text-white/70">GuardianShield</p>
          <p className="text-xl font-semibold">Fraud Ops</p>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? 'bg-white/15 border-l-4 border-brand-500' : 'hover:bg-white/10'
              }`
            }
          >
            <link.icon size={18} />
            <span className="font-semibold">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-white/10 rounded-xl border border-white/20">
        <p className="text-sm text-white/80">📱 Demo Mode</p>
        <p className="text-xs text-white/70 mb-3">Simulated UPI app inside phone mock.</p>
        <button
          className="w-full py-2.5 rounded-lg bg-brand-500 text-sm font-semibold shadow-lg"
          onClick={() => navigate('/demo')}
        >
          Launch
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
