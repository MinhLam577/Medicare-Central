import { clearProfile, getAccessToken, getProfile, saveProfile } from '../until/index.js'
import { createContext, useState, useContext, useEffect } from 'react'
// Context API

const initialAppContext = {
  isAuthenticated: Boolean(getAccessToken()),
  profile: getProfile(),
  checkedProducts: []
}
export const AuthContext = createContext(initialAppContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAppContext.isAuthenticated)
  const [isProfile, setIsProfile] = useState(initialAppContext.profile)
  const [checkedProducts, setCheckedProducts] = useState(initialAppContext.checkedProducts)
  // === Sync với localStorage ===
  useEffect(() => {
    const token = getAccessToken()
    const savedProfile = getProfile()

    setIsAuthenticated(Boolean(token))
    setIsProfile(savedProfile)
  }, [])

  // Watch localStorage changes (multi-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = getAccessToken()
      const savedProfile = getProfile()
      setIsAuthenticated(Boolean(token))
      setIsProfile(savedProfile)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = (user, token) => {
    localStorage.setItem('accesstoken', token)
    setIsAuthenticated(true)
    saveProfile(user)
    setIsProfile(user)
  }

  const logout = () => {
    localStorage.removeItem('accesstoken')
    clearProfile()
    setIsProfile(null)
    setIsAuthenticated(false)
  }

  const reset = () => {
    setCheckedProducts([])
    setIsProfile(null)
    setIsAuthenticated(false)
  }
  const setProfile = (data) => {
    saveProfile(data)
    setIsProfile(data)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        setIsProfile,
        isProfile,
        setProfile,
        checkedProducts,
        setCheckedProducts,
        reset
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => {
  return useContext(AuthContext)
}
