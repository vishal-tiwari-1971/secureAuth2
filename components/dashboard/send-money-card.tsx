"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send } from "lucide-react"

const receivers = [
  { id: "1", name: "Alice Johnson", account: "****1234" },
  { id: "2", name: "Bob Smith", account: "****5678" },
  { id: "3", name: "Carol Davis", account: "****9012" },
  { id: "4", name: "David Wilson", account: "****3456" },
]

const categories = [
  { label: 'Food & Dining', value: 'Food & Dining' },
  { label: 'Shopping', value: 'Shopping' },
  { label: 'Transportation', value: 'Transportation' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'Bills', value: 'Bills' },
];

export function SendMoneyCard() {
  const [amount, setAmount] = useState("");
  const [receiverUpi, setReceiverUpi] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-detect device info
  function getDeviceInfo() {
    const ua = navigator.userAgent;
    if (/iPhone/.test(ua)) return "iPhone";
    if (/iPad/.test(ua)) return "iPad";
    if (/Android/.test(ua)) return "Android";
    if (/Macintosh/.test(ua)) return "MacBook";
    if (/Windows/.test(ua)) return "Windows PC";
    if (/Linux/.test(ua)) return "Linux";
    // fallback to browser name
    if (/Chrome/.test(ua)) return "Chrome Browser";
    if (/Firefox/.test(ua)) return "Firefox Browser";
    if (/Safari/.test(ua)) return "Safari Browser";
    return "Unknown Device";
  }

  function getLocation() {
    return new Promise<{ lat: number | null; lng: number | null }>((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: null, lng: null });
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve({ lat: null, lng: null })
        );
      }
    });
  }

  const handleSend = async () => {
    setResult("");
    if (!amount || !receiverUpi || !category) {
      setResult("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const device = getDeviceInfo();
      const { lat, lng } = await getLocation();
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, upiId: receiverUpi, device, lat, lng, category }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult(data.error || "Transaction failed");
      } else {
        setResult(
          `✅ Transaction of ₹${data.transaction.amount} to ${data.transaction.recipientId} processed successfully. Status: ${data.transaction.status}`
        );
        setAmount("");
        setReceiverUpi("");
        setCategory("");
      }
    } catch (err) {
      setResult("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
            <Send className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="text-base md:text-lg font-semibold text-gray-900">Send Money</div>
            <div className="text-xs md:text-sm text-gray-500">Send a UPI transaction</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        <div className="space-y-2 md:space-y-3">
          <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
            Amount
          </Label>
          <div className="relative flex items-center">
            <span className="absolute left-3 inset-y-0 flex items-center h-full text-gray-400 text-base md:text-lg select-none">₹</span>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg md:rounded-xl text-sm md:text-base"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <Label htmlFor="receiver-upi" className="text-sm font-medium text-gray-700">
            Receiver UPI ID
          </Label>
          <Input
            id="receiver-upi"
            type="text"
            placeholder="e.g. receiver@upi"
            value={receiverUpi}
            onChange={(e) => setReceiverUpi(e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg md:rounded-xl text-sm md:text-base"
            disabled={loading}
          />
        </div>

        <div className="space-y-2 md:space-y-3">
          <Label htmlFor="category" className="text-sm font-medium text-gray-700">
            Category
          </Label>
          <Select value={category} onValueChange={setCategory} disabled={loading}>
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg md:rounded-xl text-sm md:text-base">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSend}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg md:rounded-xl py-2.5 md:py-3 font-medium text-sm md:text-base"
          disabled={loading}
        >
          {loading ? "Processing..." : "Send Money"}
        </Button>

        {result && (
          <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-xs md:text-sm text-gray-700 break-words">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
