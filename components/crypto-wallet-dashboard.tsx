"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { TransactionsView } from "./transactions-view";
import { OffRampView } from "./off-ramp-view";

import { Search, Bell, User, UserCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { users } from "@/lib/users";
import { buyXyle } from "@/lib/walletUtils";
import { User as UserType } from "@/lib/types/user.interface";


type View =
  | "dashboard"
  | "assets"
  | "transactions"
  | "exchange"
  | "off-ramp"
  | "on-ramp";

export function CryptoWalletDashboard() {
  const [activeView, setActiveView] = useState<View>("transactions");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [connectedUserId, setConnectedUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const handleConnectWallet = (userId: string) => {
    setConnectedUserId(userId);
    setMessage("Wallet connected!");
    setIsConnected(true);
  };


  return (
    <div className="flex flex-col md:flex-row h-screen text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center">
          <span className="font-bold text-xl">AMAZING</span>
          <span className="text-gray-400 ml-2 text-sm">Wallet</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Menu</span>
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
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 bg-gray-900 z-50 transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <div className="flex items-center">
            <span className="font-bold text-xl">AMAZING</span>
            <span className="text-gray-400 ml-2 text-sm">Wallet</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="sr-only">Close</span>
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
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>
        <div className="p-4">
          <Sidebar
            activeView={activeView}
            setActiveView={(view) => {
              setActiveView(view as View);
              setIsMobileMenuOpen(false);
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* Sidebar - Hidden on mobile */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView as (view: string) => void}
        className="hidden md:block w-64 min-w-64 border-r border-gray-800 bg-gray-950"
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-950">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="font-bold text-xl">AMAZING</span>
              <span className="text-gray-400 ml-2 text-sm">Wallet</span>
            </div>
            <nav className="hidden lg:flex items-center space-x-4">
              <button
                className={cn(
                  "px-3 py-2 text-sm",
                  activeView === "dashboard" && "font-medium"
                )}
                onClick={() => setActiveView("dashboard")}
              >
                Dashboard
              </button>
              <button
                className={cn(
                  "px-3 py-2 text-sm",
                  activeView === "assets" && "font-medium"
                )}
                onClick={() => setActiveView("assets")}
              >
                Assets
              </button>
              <button
                className={cn(
                  "px-3 py-2 text-sm",
                  activeView === "transactions" && "font-medium"
                )}
                onClick={() => setActiveView("transactions")}
              >
                Transactions
              </button>
              <button
                className={cn(
                  "px-3 py-2 text-sm",
                  activeView === "exchange" && "font-medium"
                )}
                onClick={() => setActiveView("exchange")}
              >
                Exchange
              </button>
              <button
                className={cn(
                  "px-3 py-2 text-sm",
                  activeView === "off-ramp" && "font-medium"
                )}
                onClick={() => setActiveView("off-ramp")}
              >
                Off-Ramp
              </button>
              <button
                className={cn(
                  "px-3 py-2 text-sm",
                  activeView === "on-ramp" && "font-medium"
                )}
                onClick={() => setActiveView("on-ramp")}
              >
                On-Ramp
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-400">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            {!connectedUserId && (
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2 bg-gray-900 text-white border-gray-700"
                onClick={() => handleConnectWallet(users[0].id)}
              >
                <span>Connect</span>
              </Button>
            )}
            {connectedUserId && (
              <div className="flex gap-2">
                <p className="w-20 overflow-hidden text-ellipsis">
                  {users[0].name}
                </p>
                <UserCircle2Icon size={24} color="#fff" />
              </div>
            )}
            <Button variant="ghost" size="icon" className="text-gray-400">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-6">
          {activeView === "transactions" && (
            <TransactionsView isConnected={isConnected} />
          )}
          {activeView === "off-ramp" && (
            <OffRampView isConnected={isConnected} />
          )}
          {/* Other views would be conditionally rendered here */}
        </div>
      </div>
    </div>
  );
}
