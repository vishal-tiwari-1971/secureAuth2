"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isLoggedIn: boolean
  customerId: string | null
  user: any | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkSession = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/validate-token")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setUser(data.user)
      setCustomerId(data.user.customerId)
      setIsLoggedIn(true)
    } catch {
      setUser(null)
      setCustomerId(null)
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error("Login failed")
      await checkSession()
      router.push("/dashboard")
    } catch (err) {
      setUser(null)
      setCustomerId(null)
      setIsLoggedIn(false)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      setCustomerId(null)
      setIsLoggedIn(false)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSession = async () => {
    await checkSession()
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, customerId, user, isLoading, login, logout, refreshSession }}>
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