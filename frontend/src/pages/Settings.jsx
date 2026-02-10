import { useState } from 'react'
import { FiEyeOff, FiBell, FiShield, FiLock, FiPhone, FiZap } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const Settings = () => {
  const { theme, toggleTheme } = useTheme()
  const [devMode, setDevMode] = useState(false)
  const [tapCount, setTapCount] = useState(0)

  const handleLogoTap = () => {
    setTapCount((c) => {
      const next = c + 1
      if (next >= 7) setDevMode(true)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">Control center</p>
          <h2 className="text-2xl font-semibold text-white">Settings</h2>
        </div>
        <button onClick={toggleTheme} className="px-3 py-2 rounded-lg border border-white/10 text-white bg-white/5">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="glass-card p-4 border border-white/10 space-y-3">
          <h3 className="font-semibold text-white flex items-center gap-2"><FiLock /> Security</h3>
          <label className="flex items-center justify-between text-sm">
            <span>Two-factor authentication</span>
            <input type="checkbox" defaultChecked className="accent-brand-500" />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span>Trusted devices</span>
            <button className="px-3 py-2 rounded-lg bg-white/10">Manage</button>
          </label>
        </section>

        <section className="glass-card p-4 border border-white/10 space-y-3">
          <h3 className="font-semibold text-white flex items-center gap-2"><FiBell /> Notifications</h3>
          <label className="flex items-center justify-between text-sm">
            <span>Transaction alerts</span>
            <input type="checkbox" defaultChecked className="accent-brand-500" />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span>High-risk alerts</span>
            <input type="checkbox" defaultChecked className="accent-brand-500" />
          </label>
        </section>
      </div>

      <section className="glass-card p-4 border border-white/10 space-y-3">
        <h3 className="font-semibold text-white flex items-center gap-2"><FiShield /> Preferences</h3>
        <div className="grid md:grid-cols-4 gap-3 text-sm text-white/80">
          <div>
            <p className="text-xs text-white/60">Language</p>
            <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2"><option>English</option></select>
          </div>
          <div>
            <p className="text-xs text-white/60">Currency</p>
            <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2"><option>INR</option></select>
          </div>
          <div className="flex items-center gap-2">
            <FiPhone /> <span>Sound effects</span>
            <input type="checkbox" defaultChecked className="accent-brand-500 ml-auto" />
          </div>
          <div className="flex items-center gap-2">
            <FiEyeOff /> <span>Privacy mode</span>
            <input type="checkbox" className="accent-brand-500 ml-auto" />
          </div>
        </div>
      </section>

      <section className="glass-card p-4 border border-white/10 space-y-3" onClick={handleLogoTap}>
        <h3 className="font-semibold text-white flex items-center gap-2"><FiZap /> Developer Mode</h3>
        {devMode ? (
          <div className="grid md:grid-cols-3 gap-3 text-sm text-white/80">
            <button className="px-3 py-2 rounded-lg bg-white/10">Demo scenarios</button>
            <button className="px-3 py-2 rounded-lg bg-white/10">API endpoint override</button>
            <button className="px-3 py-2 rounded-lg bg-white/10">Debug logs</button>
          </div>
        ) : (
          <p className="text-xs text-white/60">Tap logo 7 times to unlock developer tools ({Math.max(0, 7 - tapCount)} taps left)</p>
        )}
      </section>
    </div>
  )
}

export default Settings
