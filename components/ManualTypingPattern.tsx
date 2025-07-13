'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Loader2, Fingerprint } from 'lucide-react'
import { manualTypingPatternService, KeystrokeData, TypingPattern } from '@/lib/manual-typing-pattern'

interface ManualTypingPatternProps {
  mode: 'enroll' | 'verify'
  onComplete: (pattern: TypingPattern) => void
  onError?: (error: string) => void
  customerId?: string
  placeholder?: string
  className?: string
}

export function ManualTypingPattern({ 
  mode, 
  onComplete, 
  onError, 
  customerId, 
  placeholder = "Type here to record your typing pattern...",
  className 
}: ManualTypingPatternProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const keystrokesRef = useRef<KeystrokeData[]>([])
  const startTimeRef = useRef<number>(0)

  const startRecording = () => {
    console.log('Starting manual typing pattern recording...')
    
    setStatus('recording')
    setProgress(0)
    setMessage('Start typing to record your pattern...')
    setDebugInfo('Recording started - type in the textarea')
    
    // Reset keystrokes array
    keystrokesRef.current = []
    startTimeRef.current = Date.now()

    // Reset the textarea
    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (status !== 'recording') return

    const timestamp = Date.now()
    const keystroke: KeystrokeData = {
      key: e.key,
      timestamp: timestamp - startTimeRef.current,
      keyCode: e.keyCode
    }

    keystrokesRef.current.push(keystroke)
    
    // Update progress based on number of keystrokes
    const progressPercent = Math.min((keystrokesRef.current.length / 20) * 100, 100)
    setProgress(progressPercent)
    
    setDebugInfo(`Recorded ${keystrokesRef.current.length} keystrokes`)
  }

  const stopRecording = () => {
    console.log('Stopping manual recording...')
    
    if (!textareaRef.current) {
      setStatus('error')
      setMessage('Textarea not found')
      setDebugInfo('Textarea reference is null')
      onError?.('Textarea not found')
      return
    }

    const text = textareaRef.current.value
    const keystrokes = keystrokesRef.current

    console.log('Text to analyze:', text)
    console.log('Keystrokes recorded:', keystrokes.length)

    if (!text || text.trim().length < 10) {
      setStatus('error')
      setMessage('Please type at least 10 characters for a good pattern')
      setDebugInfo('Text too short for pattern analysis')
      onError?.('Text too short for pattern analysis')
      return
    }

    if (keystrokes.length < 10) {
      setStatus('error')
      setMessage('Please type more consistently for pattern analysis')
      setDebugInfo(`Only ${keystrokes.length} keystrokes recorded`)
      onError?.('Not enough keystrokes for pattern analysis')
      return
    }

    setStatus('processing')
    setIsLoading(true)

    try {
      const pattern = manualTypingPatternService.generatePattern(keystrokes, text)
      console.log('Generated pattern:', pattern)

      const qualityCheck = manualTypingPatternService.validatePatternQuality(pattern)
      console.log('Quality check:', qualityCheck)

      if (!qualityCheck.isValid) {
        setStatus('error')
        setMessage(qualityCheck.message)
        setDebugInfo(`Quality check failed: ${(qualityCheck.quality * 100).toFixed(1)}%`)
        onError?.(qualityCheck.message)
        setIsLoading(false)
        return
      }

      setProgress(100)
      setStatus('success')
      setMessage('Pattern recorded successfully!')
      setDebugInfo(`Pattern recorded with quality: ${(qualityCheck.quality * 100).toFixed(1)}%`)
      
      onComplete(pattern)
    } catch (error) {
      console.error('Error recording pattern:', error)
      setStatus('error')
      setMessage('Failed to record pattern. Please try again.')
      setDebugInfo(`Error: ${error}`)
      onError?.('Failed to record pattern')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyPattern = async () => {
    console.log('Starting manual verification...')
    
    if (!textareaRef.current || !customerId) {
      setStatus('error')
      setMessage('Missing required data for verification')
      setDebugInfo('Textarea or customerId is missing')
      onError?.('Missing required data for verification')
      return
    }

    const text = textareaRef.current.value
    const keystrokes = keystrokesRef.current

    if (!text || text.trim().length < 10) {
      setStatus('error')
      setMessage('Please type at least 10 characters for verification')
      setDebugInfo('Text too short for verification')
      onError?.('Text too short for verification')
      return
    }

    if (keystrokes.length < 10) {
      setStatus('error')
      setMessage('Please type more consistently for verification')
      setDebugInfo(`Only ${keystrokes.length} keystrokes recorded`)
      onError?.('Not enough keystrokes for verification')
      return
    }

    setStatus('processing')
    setIsLoading(true)

    try {
      const newPattern = manualTypingPatternService.generatePattern(keystrokes, text)
      console.log('New pattern for verification:', newPattern)

      // Send verification request to backend
      const response = await fetch('/api/auth/typing-pattern/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          pattern: newPattern,
          text
        })
      })

      const result = await response.json()
      console.log('Verification result:', result)

      if (result.success && result.score >= 0.7) {
        setStatus('success')
        setMessage('Verification successful!')
        setDebugInfo(`Verification successful with score: ${result.score}`)
        onComplete(newPattern)
      } else {
        setStatus('error')
        setMessage('Verification failed. Please try again.')
        setDebugInfo(`Verification failed - score: ${result.score}`)
        onError?.('Verification failed')
      }
    } catch (error) {
      console.error('Error during verification:', error)
      setStatus('error')
      setMessage('Verification failed')
      setDebugInfo(`Verification error: ${error}`)
      onError?.('Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (mode === 'enroll') {
        stopRecording()
      } else {
        verifyPattern()
      }
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      default:
        return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          <Fingerprint className="h-5 w-5" />
          {mode === 'enroll' ? 'Manual Typing Pattern Enrollment' : 'Manual Typing Pattern Verification'}
        </CardTitle>
        <CardDescription>
          {mode === 'enroll' 
            ? 'Type naturally and consistently to create your unique typing pattern. Aim for steady rhythm, not too fast or slow.'
            : 'Type the same text naturally to verify your typing pattern. Use the same rhythm as during enrollment.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="typing-text" className="text-sm font-medium">
            {mode === 'enroll' ? 'Sample Text to Type:' : 'Verification Text:'}
          </label>
          <textarea
            ref={textareaRef}
            id="typing-text"
            placeholder={placeholder}
            className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={handleKeyDown}
            onKeyPress={handleKeyPress}
            disabled={status === 'processing'}
          />
        </div>

        {status === 'recording' && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600">
              Recording your typing pattern... ({keystrokesRef.current.length} keystrokes)
            </p>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              💡 <strong>Tip:</strong> Type at a natural, steady pace. Don't rush or pause too much.
            </div>
          </div>
        )}

        {message && (
          <Alert variant={status === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Debug information - remove in production */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <div className="p-2 bg-gray-100 rounded text-xs text-gray-600">
            <strong>Debug:</strong> {debugInfo}
          </div>
        )}

        <div className="flex gap-2">
          {status === 'idle' && (
            <Button onClick={startRecording} className="flex-1">
              Start Recording
            </Button>
          )}
          
          {status === 'recording' && (
            <Button 
              onClick={stopRecording} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Stop Recording'
              )}
            </Button>
          )}

          {mode === 'verify' && status === 'idle' && (
            <Button 
              onClick={verifyPattern} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Pattern'
              )}
            </Button>
          )}

          {(status === 'success' || status === 'error') && (
            <Button 
              onClick={startRecording} 
              variant="outline"
              className="flex-1"
            >
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 