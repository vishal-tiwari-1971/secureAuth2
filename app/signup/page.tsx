"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Shield, ArrowLeft, User, Mail, Lock } from "lucide-react"
import { AuthRedirect } from "@/components/AuthRedirect"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    customerId: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
    setSuccess("")
  }

  const validateForm = () => {
    if (!formData.name.trim()) return setError("Name is required")
    if (!formData.email.trim()) return setError("Email is required")
    if (!formData.customerId.trim()) return setError("Customer ID is required")
    if (!formData.password.trim()) return setError("Password is required")
    if (formData.password.length < 6) return setError("Password must be at least 6 characters")
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          customerId: formData.customerId,
          password: formData.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Signup failed")
      setSuccess("Registration successful! Redirecting to dashboard...")
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/login" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-blue-600">CANARA BANK</h1>
              <p className="text-sm text-yellow-600 font-semibold">Together We Can</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign Up</h2>
          <p className="text-gray-600">Create your Net Banking account</p>
        </div>
        <Card className="shadow-xl border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Secure Registration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="name" name="name" type="text" placeholder="Your Name" value={formData.name} onChange={handleInputChange} className="pl-10" disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="email" name="email" type="email" placeholder="you@email.com" value={formData.email} onChange={handleInputChange} className="pl-10" disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="customerId" name="customerId" type="text" placeholder="Choose a Customer ID" value={formData.customerId} onChange={handleInputChange} className="pl-10" disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="password" name="password" type="password" placeholder="Create a password" value={formData.password} onChange={handleInputChange} className="pl-10" disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleInputChange} className="pl-10" disabled={isLoading} />
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert variant="default" className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium" disabled={isLoading}>
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      </div>
    </AuthRedirect>
  )
} 