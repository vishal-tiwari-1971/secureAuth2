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
import { SessionInfo } from "@/components/SessionInfo"

export default function DashboardPage() {
  const [showAnomalyAlert, setShowAnomalyAlert] = useState(true)
  // Debug state for cursor tracking
  const [lastBatchSize, setLastBatchSize] = useState(0)
  const [lastResponse, setLastResponse] = useState<string>("")
  const [cursorPos, setCursorPos] = useState<{x: number, y: number} | null>(null)
  const bufferRef = useRef<{x: number, y: number, t: number, action?: string}[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const sendCursorData = async (dataArray: {x: number, y: number, action?: string, timestamp: number}[]) => {
    try {
      console.log('Sending cursor batch:', dataArray.length, 'positions')
      console.log('First position:', dataArray[0])
      console.log('Last position:', dataArray[dataArray.length - 1])
      
      const response = await fetch('/api/cursor-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: dataArray,
          page: 'dashboard',
          sessionId: Date.now().toString()
        }),
      })
      
      if (response.ok) {
        const result = await response.json()
        setLastResponse(`Sent ${dataArray.length} cursor events in batch`)
        console.log('API response:', result)
      } else {
        setLastResponse('Failed to send data')
        console.error('API error:', response.status)
      }
    } catch (error) {
      console.error('Error sending cursor data:', error)
      setLastResponse('Error sending data')
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    const newPos = { x: e.clientX, y: e.clientY }
    setCursorPos(newPos)
    
    // Add to buffer (don't send immediately)
    bufferRef.current.push({ 
      x: e.clientX, 
      y: e.clientY, 
      t: Date.now(),
      action: 'move'
    })
    setLastBatchSize(bufferRef.current.length)
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    
    // Send batched data every 5 seconds
    timerRef.current = setInterval(async () => {
      if (bufferRef.current.length > 0) {
        // Convert buffer to data array
        const dataToSend = bufferRef.current.map(item => ({
          x: item.x,
          y: item.y,
          action: item.action || 'move',
          timestamp: item.t
        }))
        
        // Send all collected data as one array
        await sendCursorData(dataToSend)
        
        // Clear buffer after sending
        bufferRef.current = []
        setLastBatchSize(0)
      }
    }, 5000) // Collect for 5 seconds, then send all at once
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
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

              {/* Section G: Session Information */}
              <div className="md:col-span-1">
                <SessionInfo />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
