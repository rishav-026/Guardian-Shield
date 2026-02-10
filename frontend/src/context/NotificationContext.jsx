import { createContext, useContext, useMemo, useReducer } from 'react'

const NotificationContext = createContext()

const initialState = {
  items: [
    { id: crypto.randomUUID(), type: 'fraud', title: 'Fraud blocked', message: '₹50,000 blocked from KYC Services', time: '2m ago', read: false },
    { id: crypto.randomUUID(), type: 'safe', title: 'Transaction approved', message: '₹1,200 to Swiggy completed', time: '10m ago', read: true },
    { id: crypto.randomUUID(), type: 'alert', title: 'Unusual activity', message: 'Spike in risk score detected 2-4 AM window', time: '1h ago', read: false },
  ],
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return { ...state, items: [{ ...action.payload, id: crypto.randomUUID(), read: false }, ...state.items].slice(0, 30) }
    case 'markRead':
      return { ...state, items: state.items.map((n) => (n.id === action.id ? { ...n, read: true } : n)) }
    case 'markAll':
      return { ...state, items: state.items.map((n) => ({ ...n, read: true })) }
    case 'clear':
      return { ...state, items: [] }
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo(() => ({
    notifications: state.items,
    unreadCount: state.items.filter((n) => !n.read).length,
    addNotification: (payload) => dispatch({ type: 'add', payload }),
    markRead: (id) => dispatch({ type: 'markRead', id }),
    markAll: () => dispatch({ type: 'markAll' }),
    clearAll: () => dispatch({ type: 'clear' }),
  }), [state.items])

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
