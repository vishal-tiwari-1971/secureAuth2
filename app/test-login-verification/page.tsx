'use client'

import { useState } from 'react'
import { ManualTypingPattern } from '@/components/ManualTypingPattern'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function TestLoginVerificationPage() {
  const [customerId, setCustomerId] = useState('')
  const [password, setPassword] = useState('')
  const [typingPattern, setTypingPattern] = useState<any>(null)
  const [showTypingPattern, setShowTypingPattern] = useState(false)
  const [loginResult, setLoginResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTypingPatternComplete = (pattern: any) => {
    setTypingPattern(pattern)
    setShowTypingPattern(false)
  }

  const handleTypingPatternError = (error: string) => {
    setLoginResult(`Typing pattern error: ${error}`)
  }

  const handleLogin = async () => {
    if (!customerId || !password) {
      setLoginResult('Please enter customer ID and password')
      return
    }

    setIsLoading(true)
    setLoginResult('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          password,
          typingPattern: typingPattern ? {
            pattern: JSON.stringify(typingPattern),
            quality: typingPattern.quality || 0.5,
            text: typingPattern.text
          } : undefined
        })
      })

      const result = await response.json()

      if (response.ok) {
        setLoginResult('✅ Login successful!')
      } else {
        setLoginResult(`❌ Login failed: ${result.error}`)
      }
    } catch (error) {
      setLoginResult(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Login Verification Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Login with Typing Pattern</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerId">Customer ID</Label>
              <Input
                id="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Enter customer ID"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            <div className="space-y-2">
              <Label>Typing Pattern Verification (Optional)</Label>
              <div className="space-y-2">
                {!showTypingPattern && !typingPattern && (
                  <Button
                    onClick={() => setShowTypingPattern(true)}
                    variant="outline"
                    className="w-full"
                  >
                    Add Typing Pattern Verification
                  </Button>
                )}
                
                {showTypingPattern && (
                  <ManualTypingPattern
                    mode="verify"
                    customerId={customerId}
                    onComplete={handleTypingPatternComplete}
                    onError={handleTypingPatternError}
                    placeholder="Type the same text you used during signup..."
                  />
                )}
                
                {typingPattern && !showTypingPattern && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2 text-green-700">
                      <span className="text-sm font-medium">Typing pattern ready</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Quality score: {(typingPattern.quality * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleLogin} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Testing Login...' : 'Test Login'}
            </Button>
          </div>
        </div>

        {loginResult && (
          <Alert variant={loginResult.includes('✅') ? 'default' : 'destructive'}>
            <AlertDescription>{loginResult}</AlertDescription>
          </Alert>
        )}

        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Testing Instructions</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>First, create a user account with typing pattern at <code>/signup</code></li>
            <li>Enter the customer ID and password you used during signup</li>
            <li>Optionally add typing pattern verification</li>
            <li>Click "Test Login" to verify the authentication flow</li>
            <li>Check the result message below</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 