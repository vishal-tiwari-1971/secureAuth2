"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp } from "lucide-react"

const spendingData = [
  { name: "Food & Dining", value: 35, color: "#3B82F6" },
  { name: "Shopping", value: 25, color: "#10B981" },
  { name: "Transportation", value: 15, color: "#F59E0B" },
  { name: "Entertainment", value: 12, color: "#EF4444" },
  { name: "Bills", value: 13, color: "#8B5CF6" },
]

const trendData = [
  { month: "Jan", amount: 2400, normal: true },
  { month: "Feb", amount: 2100, normal: true },
  { month: "Mar", amount: 2800, normal: true },
  { month: "Apr", amount: 3200, normal: false },
  { month: "May", amount: 2600, normal: true },
  { month: "Jun", amount: 2900, normal: true },
]

export function SpendingGraph() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
          </div>
          <span className="text-base md:text-lg font-semibold">Spending Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 md:space-y-6">
          {/* Pie Chart */}
          <div>
            <h4 className="text-xs md:text-sm font-medium mb-2 md:mb-3">Category Breakdown</h4>
            <div className="h-[120px] md:h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div>
            <h4 className="text-xs md:text-sm font-medium mb-2 md:mb-3">Monthly Trend</h4>
            <div className="h-[100px] md:h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `$${value}`,
                      "Amount",
                      props.payload.normal ? "Normal spending" : "Above average",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 text-xs">
            {spendingData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div
                  className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
