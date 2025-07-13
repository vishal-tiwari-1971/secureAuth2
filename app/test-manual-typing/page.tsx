'use client'

import { useState } from 'react'
import { ManualTypingPattern } from '@/components/ManualTypingPattern'

export default function TestManualTypingPage() {
  const [enrolledPattern, setEnrolledPattern] = useState<any>(null)
  const [testResults, setTestResults] = useState<string[]>([])

  const handleEnrollComplete = (pattern: any) => {
    console.log('Pattern enrolled:', pattern)
    setEnrolledPattern(pattern)
    setTestResults(prev => [...prev, `Pattern enrolled with ${pattern.keystrokes.length} keystrokes`])
  }

  const handleEnrollError = (error: string) => {
    console.error('Enrollment error:', error)
    setTestResults(prev => [...prev, `Enrollment error: ${error}`])
  }

  const handleVerifyComplete = (pattern: any) => {
    console.log('Pattern verified:', pattern)
    setTestResults(prev => [...prev, 'Pattern verification completed'])
  }

  const handleVerifyError = (error: string) => {
    console.error('Verification error:', error)
    setTestResults(prev => [...prev, `Verification error: ${error}`])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manual Typing Pattern Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Enrollment Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Enrollment Test</h2>
            <ManualTypingPattern
              mode="enroll"
              onComplete={handleEnrollComplete}
              onError={handleEnrollError}
              placeholder="Type your name and a short sentence to create your unique typing pattern..."
            />
          </div>

          {/* Verification Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Verification Test</h2>
            <ManualTypingPattern
              mode="verify"
              customerId="test123"
              onComplete={handleVerifyComplete}
              onError={handleVerifyError}
              placeholder="Type the same text to verify your pattern..."
            />
          </div>
        </div>

        {/* Test Results */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Test Results</h3>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded text-sm">
                {result}
              </div>
            ))}
            {testResults.length === 0 && (
              <p className="text-gray-500">No test results yet. Try enrolling a pattern first.</p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Testing Instructions</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Start Recording" in the Enrollment Test</li>
            <li>Type at least 10 characters consistently</li>
            <li>Click "Stop Recording" to generate the pattern</li>
            <li>Check the test results below</li>
            <li>Try the verification test with the same text</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 