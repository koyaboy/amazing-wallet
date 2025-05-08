import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Eye, RefreshCw, History, HelpCircle } from "lucide-react"

export function OffRampView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">XYLE Off-Ramp</h2>
        <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white">
          Convert XYLE to Fiat
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h3 className="text-lg font-medium">Your XYLE Balance</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">72.46</div>
                <div className="text-gray-400">XYLE</div>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Eye className="h-5 w-5" />
                <span className="sr-only">Show/Hide Balance</span>
              </Button>
            </div>
            <div className="text-gray-400">= $10,000.00 USD</div>
            <div className="text-sm text-gray-400">Fixed Rate: $138.00 USD per XYLE</div>

            <div className="flex space-x-2 pt-4">
              <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white">
                <History className="mr-2 h-4 w-4" />
                View History
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-800 mt-4">
              <h4 className="font-medium mb-2">XYLE Token Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Token Type:</div>
                <div className="text-right">Security Token (PMA)</div>
                <div className="text-gray-400">Total Supply:</div>
                <div className="text-right">3,200,000 XYLE</div>
                <div className="text-gray-400">Fixed Price:</div>
                <div className="text-right">$138.00 USD</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h3 className="text-lg font-medium">Convert XYLE to Fiat</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label>From</Label>
                <div className="text-sm text-gray-400">Available Balance: 72.46 XYLE</div>
              </div>
              <div className="relative">
                <Input type="text" value="5" className="bg-gray-800 border-gray-700 text-white pr-24" />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <div className="bg-gray-700 text-white px-3 h-full flex items-center rounded-r-md">
                    <span className="mr-2">×</span>
                    <span>XYLE</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-right mt-1 text-gray-400">≈ $690.00</div>
            </div>

            <div className="flex justify-center">
              <div className="bg-gray-800 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label>To</Label>
                <div className="text-sm text-gray-400">Receiving</div>
              </div>
              <div className="relative">
                <Input type="text" value="690.00" className="bg-gray-800 border-gray-700 text-white pr-24" />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button variant="ghost" className="h-full rounded-l-none border-l border-gray-700 px-3">
                    <span className="mr-2">$</span>
                    <span>USD</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2 h-4 w-4"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Payout Method</h4>
              <RadioGroup defaultValue="bank">
                <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-md">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">Bank Account (ACH)</Label>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-md">
                  <RadioGroupItem value="wire" id="wire" />
                  <Label htmlFor="wire">Wire Transfer</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="flex items-center">
                <div className="mr-1">Rate</div>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
              <div>1 XYLE = $138.00 USD</div>
            </div>

            <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">Convert to Fiat</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
