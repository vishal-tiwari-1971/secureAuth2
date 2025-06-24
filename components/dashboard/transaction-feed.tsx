"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreditCard, MapPin, Smartphone, Clock } from "lucide-react"

const transactions = [
  {
    id: 1,
    amount: "$250.00",
    receiver: "Amazon",
    time: "2 min ago",
    location: "Seattle, WA",
    device: "iPhone 14",
    status: "Normal",
  },
  {
    id: 2,
    amount: "$1,500.00",
    receiver: "John Smith",
    time: "15 min ago",
    location: "New York, NY",
    device: "MacBook Pro",
    status: "Suspicious",
  },
  {
    id: 3,
    amount: "$45.99",
    receiver: "Starbucks",
    time: "1 hour ago",
    location: "San Francisco, CA",
    device: "iPhone 14",
    status: "Normal",
  },
  {
    id: 4,
    amount: "$89.50",
    receiver: "Uber",
    time: "2 hours ago",
    location: "Los Angeles, CA",
    device: "Android",
    status: "Normal",
  },
  {
    id: 5,
    amount: "$2,000.00",
    receiver: "Unknown Merchant",
    time: "3 hours ago",
    location: "Miami, FL",
    device: "Unknown",
    status: "Suspicious",
  },
]

export function TransactionFeed() {
  return (
    <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
            <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <div className="text-base md:text-lg font-semibold text-gray-900">Transaction Feed</div>
            <div className="text-xs md:text-sm text-gray-500">Recent transactions</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] md:h-[400px] px-4 md:px-6">
          <div className="space-y-3 md:space-y-4 pb-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-2 md:mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-base md:text-lg text-gray-900 truncate">{transaction.amount}</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">to {transaction.receiver}</p>
                  </div>
                  <Badge
                    variant={transaction.status === "Normal" ? "secondary" : "destructive"}
                    className={`ml-2 flex-shrink-0 text-xs ${
                      transaction.status === "Normal"
                        ? "bg-green-100 text-green-800 border-green-200 rounded-md md:rounded-lg"
                        : "bg-red-100 text-red-800 border-red-200 rounded-md md:rounded-lg"
                    }`}
                  >
                    {transaction.status}
                  </Badge>
                </div>

                <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{transaction.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-3 w-3 text-purple-500 flex-shrink-0" />
                    <span className="truncate">{transaction.device}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                    <span>{transaction.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
