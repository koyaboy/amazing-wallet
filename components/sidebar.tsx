"use client"

import { Home, BarChart2, ArrowUpRight, ArrowDownLeft, History, Shield, Settings, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  className?: string
}

export function Sidebar({ activeView, setActiveView, className }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "assets", label: "Assets", icon: BarChart2 },
    { id: "exchange", label: "Exchange", icon: ArrowUpRight },
    { id: "off-ramp", label: "Off-Ramp", icon: ArrowDownLeft },
    { id: "on-ramp", label: "On-Ramp", icon: ArrowUpRight },
    { id: "transaction-history", label: "Transaction History", icon: History },
    { id: "security", label: "Security", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "support", label: "Support", icon: HelpCircle },
  ]

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
                  activeView === item.id
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="mb-2">
          <div className="text-sm font-medium">MichiganSecure, LLC</div>
          <div className="text-xs text-gray-400">XYLE Private Membership Association</div>
          <div className="text-xs text-gray-400">Available Supply: 3.2M XYLE</div>
        </div>
      </div>
    </div>
  )
}
