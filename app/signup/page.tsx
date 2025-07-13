"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Shield, ArrowLeft, User, Mail, Lock, Fingerprint } from "lucide-react"
import { AuthRedirect } from "@/components/AuthRedirect"
import { useAuth } from "@/contexts/AuthContext"
import { ManualTypingPattern } from "@/components/ManualTypingPattern"
import { TypingGuide } from "@/components/TypingGuide"

export default function SignUpPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    customerId: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [imageUploading, setImageUploading] = useState(false)
  const [showTypingPattern, setShowTypingPattern] = useState(false)
  const [typingPattern, setTypingPattern] = useState<{
    pattern: string
    quality: number
    text: string
  } | null>(null)

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

  const handleTypingPatternComplete = (pattern: any) => {
    setTypingPattern({ 
      pattern: JSON.stringify(pattern), 
      quality: pattern.quality || 0.5, 
      text: pattern.text 
    })
    setShowTypingPattern(false)
    setSuccess("Typing pattern recorded successfully!")
  }

  const handleTypingPatternError = (error: string) => {
    setError(`Typing pattern error: ${error}`)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    try {
      const formDataImg = new FormData()
      formDataImg.append("file", file)
      formDataImg.append("upload_preset", "secureAuth")
      
      const res = await fetch("https://api.cloudinary.com/v1_1/dtebmtl6w/image/upload", {
        method: "POST",
        body: formDataImg,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || "Upload failed")
      setFormData(prev => ({ ...prev, profileImage: data.secure_url }))
    } catch (err) {
      setError("Image upload failed. Please try again.")
    } finally {
      setImageUploading(false)
    }
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
          profileImage: formData.profileImage,
          typingPattern: typingPattern,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Signup failed")
      
      // After successful signup, automatically log in
      setSuccess("Registration successful! Logging you in...")
      await login(formData.customerId, formData.password)
      router.push("/dashboard")
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
              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image</Label>
                <Input id="profileImage" name="profileImage" type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading || imageUploading} />
                {imageUploading && <p className="text-xs text-blue-600">Uploading...</p>}
                {formData.profileImage && (
                  <img src={formData.profileImage} alt="Profile Preview" className="h-16 w-16 rounded-full mt-2 object-cover border" />
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4" />
                  Typing Pattern (Optional)
                </Label>
                <div className="space-y-2">
                  {!showTypingPattern && !typingPattern && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowTypingPattern(true)}
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Set Up Typing Pattern
                    </Button>
                  )}
                  
                  {showTypingPattern && (
                    <>
                      <TypingGuide className="mb-4" />
                      <ManualTypingPattern
                        mode="enroll"
                        onComplete={handleTypingPatternComplete}
                        onError={handleTypingPatternError}
                        placeholder="Type your name and a short sentence to create your unique typing pattern..."
                        className="mb-4"
                      />
                    </>
                  )}
                  
                  {typingPattern && !showTypingPattern && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2 text-green-700">
                        <Fingerprint className="h-4 w-4" />
                        <span className="text-sm font-medium">Typing pattern recorded</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        Quality score: {(typingPattern.quality * 100).toFixed(1)}%
                      </p>
                    </div>
                  )}
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