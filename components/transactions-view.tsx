import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight, Bookmark, CreditCard, ExternalLink } from "lucide-react"

export function TransactionsView() {
  const transactions = [
    { date: "May 5, 2025", type: "Off-Ramp", amount: "3.62 XYLE → $500.00 USD", status: "Completed" },
    { date: "Apr 28, 2025", type: "On-Ramp", amount: "$1,380.00 USD → 10.00 XYLE", status: "Completed" },
    { date: "Apr 15, 2025", type: "Off-Ramp", amount: "2.17 XYLE → $300.00 USD", status: "Completed" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recent Transactions</h2>
        <Button variant="link" className="text-gray-400">
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-800">
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Amount</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-b border-gray-800">
                <td className="py-4">{transaction.date}</td>
                <td className="py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${transaction.type === "On-Ramp" ? "bg-blue-900/30 text-blue-400" : "bg-green-900/30 text-green-400"}`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="py-4">{transaction.amount}</td>
                <td className="py-4 text-gray-400">{transaction.status}</td>
                <td className="py-4">
                  <Button variant="ghost" size="icon" className="text-gray-400">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <h3 className="text-xl font-bold">Quick On-Ramp</h3>
          <div className="flex justify-between items-center">
            <div></div>
            <Button variant="link" className="text-gray-400 text-sm">
              Go to Full On-Ramp
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Purchase XYLE with USD</h4>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter USD amount"
                className="bg-gray-800 border-gray-700 text-white pr-16"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                USD
              </div>
            </div>
            <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">Buy XYLE</Button>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Payment Methods</h4>
            <Button variant="outline" className="w-full justify-between bg-gray-800 border-gray-700 text-white">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Credit/Debit Card
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between bg-gray-800 border-gray-700 text-white">
              <div className="flex items-center">
                <Bookmark className="mr-2 h-4 w-4" />
                Bank Transfer
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
