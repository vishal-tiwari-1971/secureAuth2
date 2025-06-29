"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isLoggedIn: boolean
  customerId: string | null
  login: (customerId: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on component mount (client-side only)
    const loginStatus = localStorage.getItem("isLoggedIn")
    const storedCustomerId = localStorage.getItem("customerId")
    
    if (loginStatus === "true" && storedCustomerId) {
      setIsLoggedIn(true)
      setCustomerId(storedCustomerId)
    }
    
    setIsLoading(false)
  }, [])

  const login = (customerId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("customerId", customerId)
    }
    setIsLoggedIn(true)
    setCustomerId(customerId)
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("customerId")
    }
    setIsLoggedIn(false)
    setCustomerId(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, customerId, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 