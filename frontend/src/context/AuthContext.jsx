import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext()

const mockUser = {
  name: 'Priya Sharma',
  role: 'Fraud Analyst',
  email: 'priya.sharma@guardianshield.ai',
  avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=FF6B35&color=fff',
}

export const AuthProvider = ({ children }) => {
  const [user] = useState(mockUser)
  const value = useMemo(() => ({ user }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
