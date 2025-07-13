'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lightbulb, Clock, Target, AlertTriangle } from 'lucide-react'

interface TypingGuideProps {
  className?: string
}

export function TypingGuide({ className }: TypingGuideProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Typing Pattern Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-700">Do's</h4>
              <ul className="text-sm text-gray-600 space-y-1 mt-1">
                <li>• Type at your natural, comfortable speed</li>
                <li>• Maintain a steady rhythm throughout</li>
                <li>• Type at least 15-20 characters</li>
                <li>• Use the same text for enrollment and verification</li>
                <li>• Take small pauses between words naturally</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-700">Don'ts</h4>
              <ul className="text-sm text-gray-600 space-y-1 mt-1">
                <li>• Don't type too fast (like a robot)</li>
                <li>• Don't type too slow (with long pauses)</li>
                <li>• Don't copy-paste text</li>
                <li>• Don't use different text for verification</li>
                <li>• Don't rush or stress about timing</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-700">Timing Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1 mt-1">
                <li>• Aim for 100-500ms between keystrokes</li>
                <li>• Natural pauses between words are good</li>
                <li>• Be consistent but not robotic</li>
                <li>• Think of it like typing an email to a friend</li>
              </ul>
            </div>
          </div>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Example:</strong> "My name is John and I work at Canara Bank" - Type this naturally, 
            as if you're writing an email to someone you know well.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
} 