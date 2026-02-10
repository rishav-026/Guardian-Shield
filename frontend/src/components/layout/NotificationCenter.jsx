import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiAlertTriangle, FiShield, FiX } from 'react-icons/fi'
import { useNotifications } from '../../context/NotificationContext'

const iconMap = {
  fraud: <FiShield className="text-danger" />,
  alert: <FiAlertTriangle className="text-warning" />,
  safe: <FiCheckCircle className="text-success" />,
}

const NotificationCenter = ({ onClose }) => {
  const { notifications, markRead, markAll, clearAll } = useNotifications()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="absolute right-0 mt-2 w-96 rounded-2xl bg-[#0f172a]/95 border border-white/10 shadow-glass z-30 backdrop-blur"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <p className="font-semibold text-white">Notifications</p>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <button onClick={markAll} className="hover:text-white">Mark all</button>
            <button onClick={clearAll} className="hover:text-white">Clear</button>
            <button onClick={onClose} className="text-white/50 hover:text-white"><FiX /></button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 ${n.read ? 'bg-transparent' : 'bg-white/5'}`}
              onMouseEnter={() => !n.read && markRead(n.id)}
            >
              <div className="mt-1">{iconMap[n.type] || <FiAlertTriangle className="text-white/50" />}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{n.title}</p>
                <p className="text-xs text-white/70">{n.message}</p>
                <p className="text-[11px] text-white/50 mt-1">{n.time}</p>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-center text-white/60 py-8">No notifications</p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationCenter
