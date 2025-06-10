"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { bsc, bscTestnet, mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended Wallet",
      wallets: [metaMaskWallet],
    },
    {
      groupName: "Other",
      wallets: [metaMaskWallet],
    },
  ],
  {
    appName: "XYLE Demo",
    projectId,
  }
);

const config = createConfig({
  chains: [bsc],
  // turn off injected provider discovery
  multiInjectedProviderDiscovery: false,
  connectors,
  ssr: true,
  transports: { [bsc.id]: http() },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>{" "}
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
