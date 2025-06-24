"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, MapPin, Clock, Shield } from "lucide-react"

interface AnomalyAlertProps {
  onDismiss: () => void
}

export function AnomalyAlert({ onDismiss }: AnomalyAlertProps) {
  return (
    <Card className="h-full border-2 border-red-200 bg-red-50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 md:pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <div className="text-base md:text-lg font-semibold text-red-800">Anomaly Detected</div>
              <div className="text-xs md:text-sm text-red-600">Requires immediate attention</div>
            </div>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-red-600 hover:bg-red-100 rounded-lg p-2 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        <div className="space-y-3 md:space-y-4">
          <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center text-sm md:text-base">
              <Shield className="h-3 w-3 md:h-4 md:w-4 mr-2 flex-shrink-0" />
              Suspicious Transaction
            </h4>
            <p className="text-xs md:text-sm text-red-700">Large transfer of $2,000 to unknown recipient detected</p>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <Badge variant="destructive" className="bg-red-200 text-red-800 border-red-300 rounded-lg text-xs">
              40% Normal
            </Badge>
            <span className="text-xs md:text-sm text-red-700 font-medium">Confidence Score</span>
          </div>

          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center space-x-2 md:space-x-3 bg-white p-2 md:p-3 rounded-lg md:rounded-xl border border-red-200">
              <MapPin className="h-3 w-3 md:h-4 md:w-4 text-blue-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-xs md:text-sm font-medium text-gray-900">Location:</span>
                <span className="text-xs md:text-sm text-red-700 ml-1">Miami, FL (Unusual)</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3 bg-white p-2 md:p-3 rounded-lg md:rounded-xl border border-red-200">
              <Clock className="h-3 w-3 md:h-4 md:w-4 text-yellow-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-xs md:text-sm font-medium text-gray-900">Time:</span>
                <span className="text-xs md:text-sm text-red-700 ml-1">3:00 AM (Off-hours)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl border border-red-200">
            <p className="text-xs md:text-sm text-red-800 font-semibold mb-2 md:mb-3">⚠️ Risk Factors:</p>
            <ul className="text-xs md:text-sm text-red-700 space-y-1">
              <li>• Transaction from new location</li>
              <li>• Amount exceeds daily average</li>
              <li>• Unusual time of transaction</li>
              <li>• New recipient not in contacts</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg md:rounded-xl text-xs md:text-sm"
          >
            This was me
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1 bg-red-600 hover:bg-red-700 rounded-lg md:rounded-xl text-xs md:text-sm"
          >
            Report Fraud
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
