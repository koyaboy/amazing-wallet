import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { User } from "@/lib/types/user.interface";
import { users } from "@/lib/users";
import { buyXyle } from "@/lib/walletUtils";
import { ArrowRight, Bookmark, CreditCard, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import {
  useBuyToken,
  useSellToken,
  TOKEN_CONTRACT_ADDRESS,
} from "@/lib/tokenContract";
import { parseUnits } from "viem";

import XyleLoadingOverlay from "./loading-screen";

export function TransactionsView({ isConnected }: { isConnected: boolean }) {
  const [buyAmount, setBuyAmount] = useState<number>(0);
  const [userList, setUserList] = useState<User[]>([...users]);
  const [showLoading, setShowLoading] = useState<boolean>(false);

  // Wagmi hooks for wallet interaction
  const { address } = useAccount();

  // Get user's BNB balance
  // const { data: bnbBalance, refetch: refetchBnbBalance } = useBalance({
  //   address,
  // });
  const { data: tokenBalance, refetch: refetchTokenBalance } = useBalance({
    address, // user's wallet address
    token: "0xBd593b841c8fA31fc7d0ad3436e65DDbAc495F8a", // your token's contract address
  });

  // console.log("tokenBalance", tokenBalance);

  // Token transaction hooks
  const {
    buyToken,
    hash: buyHash,
    isPending: isBuyPending,
    isConfirming: isBuyConfirming,
    isConfirmed: isBuyConfirmed,
  } = useBuyToken();

  // Track transaction hash for BSCScan link
  const [txHash, setTxHash] = useState<string | null>(null);

  // Monitor transaction status and update UI accordingly
  useEffect(() => {
    if (buyHash) {
      setTxHash(buyHash);
      setShowLoading(true);
    }

    refetchTokenBalance();

    console.log(tokenBalance);
    // if (isBuyConfirmed || isSellConfirmed) {
    //   // Refresh balances after transaction is confirmed
    //   refetchBnbBalance();
    // }
  }, [buyHash]);

  const handleBuy = async (id: string) => {
    if (!address) {
      alert("Please Connect Your Wallet");
      return;
    }

    if (Number(buyAmount) > userList[0].usdtBalance) {
      alert("Insufficient USD balance");
      return;
    }

    try {
      // Start the blockchain transaction
      await buyToken(address, buyAmount / 138);
      // Loading screen will be shown by the useEffect monitoring buyHash
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("Transaction failed. See console for details.");
      setShowLoading(false);
    }
  };

  const handleComplete = (id: string) => {
    // This is called when the loading animation completes
    // Now update the local state with buyXyle
    const result = buyXyle(id, buyAmount);
    if (result.success) {
      setUserList([...users]);
      alert("XYLE purchase successful");
    } else {
      alert("Failed to update local state");
    }
    setShowLoading(false);
  };

  const transactions = [
    {
      date: "May 5, 2025",
      type: "Off-Ramp",
      amount: "3.62 XYLE → $500.00 USD",
      status: "Completed",
    },
    {
      date: "Apr 28, 2025",
      type: "On-Ramp",
      amount: "$1,380.00 USD → 10.00 XYLE",
      status: "Completed",
    },
    {
      date: "Apr 15, 2025",
      type: "Off-Ramp",
      amount: "2.17 XYLE → $300.00 USD",
      status: "Completed",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recent Transactions</h2>
        <Button variant="link" className="text-gray-400">
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2 text-sm text-white">
          <thead>
            <tr className="text-gray-400 uppercase text-xs">
              <th className="py-2 text-left">Date</th>
              <th className="py-2 text-left">Type</th>
              <th className="py-2 text-left">Amount</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className="bg-[#1a1f2c] hover:bg-[#222835] transition-colors duration-150 rounded-md"
              >
                <td className="py-3 px-4 rounded-l-md">{transaction.date}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      transaction.type === "On-Ramp"
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-green-900/30 text-green-400"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="py-3 px-4">{transaction.amount}</td>
                <td className="py-3 px-4 text-gray-400">
                  {transaction.status}
                </td>
                <td className="py-3 px-4 rounded-r-md">
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
          <h3 className="text-xl font-bold text-white">Quick On-Ramp</h3>
          <div className="flex justify-between items-center">
            <div></div>
            <Button variant="link" className="text-gray-400 text-sm">
              Go to Full On-Ramp
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between text-white">
              <h4 className="font-medium">Purchase XYLE with USD</h4>
              <h4 className="font-medium">
                Balance : ${userList[0].usdtBalance}
              </h4>
            </div>

            <div className="relative">
              <Input
                type="text"
                placeholder="Enter USD amount"
                className="bg-gray-800 border-gray-700 text-white pr-16"
                onChange={(e) => setBuyAmount(Number(e.target.value))}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                USD
              </div>
            </div>

            <Button
              onClick={() => handleBuy(userList[0].id)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white"
              // disabled={!isConnected}
            >
              Buy XYLE
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Payment Methods</h4>

            <Button
              variant="outline"
              className="w-full justify-between bg-gray-800 border-gray-700 text-white"
            >
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Credit/Debit Card
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between bg-gray-800 border-gray-700 text-white"
            >
              <div className="flex items-center">
                <Bookmark className="mr-2 h-4 w-4" />
                Bank Transfer
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <XyleLoadingOverlay
        isVisible={showLoading}
        onComplete={() => handleComplete(userList[0].id)}
        amount={buyAmount}
        usdValue={buyAmount / 138}
        rate={138}
        type="on-ramp"
      />
    </div>
  );
}
