"use client";

import { useState } from "react";
import { CryptoWalletDashboard } from "@/components/crypto-wallet-dashboard";
import { AuthScreen } from "@/components/auth-screen";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <main className="min-h-screen bg-black">
      {isAuthenticated ? (
        <CryptoWalletDashboard onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <AuthScreen onLogin={() => setIsAuthenticated(true)} />
      )}
    </main>
  );
}
