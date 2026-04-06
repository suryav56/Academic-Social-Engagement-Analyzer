import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ssea_token'))
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('ssea_user')
      return u ? JSON.parse(u) : null
    } catch { return null }
  })

  const login = useCallback((tokenVal, userVal) => {
    localStorage.setItem('ssea_token', tokenVal)
    localStorage.setItem('ssea_user', JSON.stringify(userVal))
    setToken(tokenVal)
    setUser(userVal)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ssea_token')
    localStorage.removeItem('ssea_user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
