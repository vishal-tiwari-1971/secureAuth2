"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

const transactionLocations = [
  { id: 1, city: "New York", lat: 40.7128, lng: -74.006, status: "safe", amount: "$250" },
  { id: 2, city: "Los Angeles", lat: 34.0522, lng: -118.2437, status: "safe", amount: "$89" },
  { id: 3, city: "Miami", lat: 25.7617, lng: -80.1918, status: "anomaly", amount: "$2000" },
  { id: 4, city: "Seattle", lat: 47.6062, lng: -122.3321, status: "safe", amount: "$45" },
  { id: 5, city: "Chicago", lat: 41.8781, lng: -87.6298, status: "safe", amount: "$120" },
]

export function MapVisualization() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
          </div>
          <span className="text-base md:text-lg font-semibold">Transaction Map</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[200px] md:h-[300px] bg-gray-100 rounded-lg overflow-hidden">
          {/* Simplified map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                {/* Simplified US map outline */}
                <path
                  d="M50 150 Q100 100 150 120 Q200 110 250 130 Q300 120 350 140 L350 200 Q300 220 250 210 Q200 220 150 200 Q100 210 50 190 Z"
                  fill="currentColor"
                  className="text-gray-300"
                />
              </svg>
            </div>
          </div>

          {/* Transaction points */}
          {transactionLocations.map((location) => (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{
                left: `${((location.lng + 125) / 50) * 100}%`,
                top: `${((50 - location.lat) / 25) * 100}%`,
              }}
            >
              <div
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white shadow-lg ${
                  location.status === "safe" ? "bg-green-500" : "bg-red-500 animate-pulse"
                }`}
              />

              {/* Tooltip */}
              <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {location.city}: {location.amount}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 md:mt-4 flex items-center justify-center space-x-4 md:space-x-6 text-xs md:text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
            <span>Safe Transaction</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
            <span>Anomaly Detected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
