"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, DollarSign } from "lucide-react"

const receivers = [
  { id: "1", name: "Alice Johnson", account: "****1234" },
  { id: "2", name: "Bob Smith", account: "****5678" },
  { id: "3", name: "Carol Davis", account: "****9012" },
  { id: "4", name: "David Wilson", account: "****3456" },
]

export function SendMoneyCard() {
  const [amount, setAmount] = useState("")
  const [receiver, setReceiver] = useState("")
  const [simulationResult, setSimulationResult] = useState("")

  const handleSimulate = () => {
    if (!amount || !receiver) {
      setSimulationResult("Please fill in all fields")
      return
    }

    const selectedReceiver = receivers.find((r) => r.id === receiver)
    const isHighAmount = Number.parseFloat(amount) > 1000

    if (isHighAmount) {
      setSimulationResult(
        `⚠️ High-value transaction of $${amount} to ${selectedReceiver?.name} flagged for review. Additional verification required.`,
      )
    } else {
      setSimulationResult(
        `✅ Transaction of $${amount} to ${selectedReceiver?.name} processed successfully. No anomalies detected.`,
      )
    }
  }

  return (
    <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
            <Send className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="text-base md:text-lg font-semibold text-gray-900">Send Money</div>
            <div className="text-xs md:text-sm text-gray-500">Simulate transactions</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        <div className="space-y-2 md:space-y-3">
          <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
            Amount
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg md:rounded-xl text-sm md:text-base"
            />
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <Label htmlFor="receiver" className="text-sm font-medium text-gray-700">
            Receiver
          </Label>
          <Select value={receiver} onValueChange={setReceiver}>
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg md:rounded-xl text-sm md:text-base">
              <SelectValue placeholder="Select receiver" />
            </SelectTrigger>
            <SelectContent className="rounded-lg md:rounded-xl">
              {receivers.map((person) => (
                <SelectItem key={person.id} value={person.id} className="rounded-lg text-sm md:text-base">
                  <span className="block truncate">
                    {person.name} ({person.account})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSimulate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg md:rounded-xl py-2.5 md:py-3 font-medium text-sm md:text-base"
        >
          Simulate Transaction
        </Button>

        {simulationResult && (
          <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-xs md:text-sm text-gray-700 break-words">{simulationResult}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
