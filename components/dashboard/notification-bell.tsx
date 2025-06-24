"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export function NotificationBell() {
  const [notifications] = useState([
    { id: 1, message: "Suspicious transaction detected", time: "2 min ago", type: "alert" },
    { id: 2, message: "Login from new device", time: "5 min ago", type: "warning" },
    { id: 3, message: "Transaction completed successfully", time: "10 min ago", type: "success" },
  ])

  const alertCount = notifications.filter((n) => n.type === "alert").length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
          {alertCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {alertCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 md:w-80" align="end">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm md:text-base">Notifications</h3>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-3 rounded-lg bg-gray-50 border">
                <p className="text-xs md:text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
