"use client"

import { useState, useEffect, useRef } from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { SendMoneyCard } from "@/components/dashboard/send-money-card"
import { TransactionFeed } from "@/components/dashboard/transaction-feed"
import { AnomalyAlert } from "@/components/dashboard/anomaly-alert"
import { MapVisualization } from "@/components/dashboard/map-visualization"
import { AuthActivity } from "@/components/dashboard/auth-activity"
import { SpendingGraph } from "@/components/dashboard/spending-graph"

export default function DashboardPage() {
  const [showAnomalyAlert, setShowAnomalyAlert] = useState(true)
  // Debug state for cursor tracking
  const [lastBatchSize, setLastBatchSize] = useState(0)
  const [lastResponse, setLastResponse] = useState<string>("")
  const [cursorPos, setCursorPos] = useState<{x: number, y: number} | null>(null)
  const bufferRef = useRef<{x: number, y: number, t: number}[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      bufferRef.current.push({ x: e.clientX, y: e.clientY, t: Date.now() })
      setCursorPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMove)
    timerRef.current = setInterval(async () => {
      if (bufferRef.current.length > 0) {
        const batch = [...bufferRef.current]
        setLastBatchSize(batch.length)
        bufferRef.current = []
        console.log('Sending cursor batch:', batch)
        try {
          const res = await fetch('/api/cursor-track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: batch }),
          })
          const json = await res.json()
          setLastResponse(JSON.stringify(json))
        } catch (err) {
          setLastResponse('Error sending data')
        }
      }
    }, 2000)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <ProtectedRoute>
      {/* Debug floating box */}
      <div style={{position:'fixed',bottom:16,right:16,zIndex:9999,background:'#fff',border:'1px solid #ddd',borderRadius:8,padding:12,boxShadow:'0 2px 8px #0001',fontSize:12}}>
        <div><b>Cursor Debug</b></div>
        <div>Last batch size: {lastBatchSize}</div>
        <div>Last response: {lastResponse}</div>
        <div>Cursor position: {cursorPos ? `${cursorPos.x}, ${cursorPos.y}` : 'N/A'}</div>
      </div>
      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar - Fixed positioning */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar (includes mobile sidebar) */}
          <TopBar />

          {/* Dashboard Grid */}
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-[1600px] mx-auto">
              {/* Section A: Send Money Simulation */}
              <div className="md:col-span-1">
                <SendMoneyCard />
              </div>

              {/* Section B: Transaction Feed */}
              <div className="md:col-span-1">
                <TransactionFeed />
              </div>

              {/* Section C: Anomaly Alert */}
              {showAnomalyAlert && (
                <div className="md:col-span-2 xl:col-span-1">
                  <AnomalyAlert onDismiss={() => setShowAnomalyAlert(false)} />
                </div>
              )}

              {/* Section D: Map Visualization */}
              <div className={`md:col-span-2 ${!showAnomalyAlert ? "xl:col-span-2" : "xl:col-span-1"}`}>
                <MapVisualization />
              </div>

              {/* Section E: Auth Activity */}
              <div className="md:col-span-1">
                <AuthActivity />
              </div>

              {/* Section F: Spending Graph */}
              <div className="md:col-span-1">
                <SpendingGraph />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
