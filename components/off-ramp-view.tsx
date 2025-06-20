"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Eye, RefreshCw, History, HelpCircle } from "lucide-react";

import { users } from "@/lib/users";

import { useState, useEffect } from "react";
import { convertXyleToUsdt } from "@/lib/walletUtils";
import { User } from "@/lib/types/user.interface";
import {
  useBuyToken,
  useSellToken,
  TOKEN_CONTRACT_ADDRESS,
} from "@/lib/tokenContract";
import { parseUnits } from "viem";
import XyleLoadingOverlay from "./loading-screen";
import { useAccount, useBalance } from "wagmi";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import {
  buildMintTransaction,
  buildTransferTransaction,
  client,
  getWalletBalance,
} from "@/lib/sui-utils/SuiClient";
import { getCoins } from "@/lib/sui-utils/getCoins";
import { Transaction } from "@mysten/sui/transactions";

export function OffRampView({ isConnected }: { isConnected: boolean }) {
  const [transfer, setTransfer] = useState<{
    from: string;
    to: string;
    amount: number;
  }>({
    from: "1",
    to: "2",
    amount: 0,
  });

  const [convertAmount, setConvertAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [userList, setUserList] = useState<User[]>([...users]);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { address } = useAccount();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const [xyleBalance, setXyleBalance] = useState(0);
  const [txComplete, setTxComplete] = useState(false);
  const [coinId, setCoinId] = useState<string | null>(null);

  //1. get current user address
  const account = useCurrentAccount();

  const {
    sellToken,
    hash: sellHash,
    isPending: isSellPending,
    isConfirming: isSellConfirming,
    isConfirmed: isSellConfirmed,
  } = useSellToken();

  const {
    data: tokenBalance,
    refetch: refetchTokenBalance,
    isLoading: isBalanceLoading,
  } = useBalance({
    address, // user's wallet address
    token: "0xBd593b841c8fA31fc7d0ad3436e65DDbAc495F8a", // your token's contract address
  });

  useEffect(() => {
    if (txComplete) {
      setShowLoading(true);
    }
  }, [txComplete]);

  useEffect(() => {
    if (isSellConfirmed) {
      setTimeout(() => {
        refetchTokenBalance().then(() => {
          setShowLoading(false);
        });
      }, 3000); // wait 3 seconds before refetching
    }
  }, [isSellConfirmed, refetchTokenBalance]);

  const handleConvert = async () => {
    setTxComplete(false);

    if (Number(convertAmount) > xyleBalance) {
      alert("Insufficient balance");
      return;
    }

    if (!account) {
      alert("Connect wallet");
      return;
    }

    if (!convertAmount) {
      alert("Enter recipient and amount");
      return;
    }

    if (!coinId) {
      alert("Please wait whiloe we get coin ID");
      return;
    }
    const coinObject = await client.getObject({
      id: coinId,
      options: { showContent: true },
    });

    console.log("Coin object details:", coinObject);

    const amountInBaseUnits = Number(convertAmount) * 100_000_000;

    try {
      // const tx = buildTransferTransaction({
      //   recipient:
      //     "0xa180e8ec28603cba892d1505170abb7b2c5a87c5e7b61f0b0036419fe7f7ae4e",
      //   amount: amountInBaseUnits,
      //   coinObjectId: coinId,
      // });

      // Get ALL coin objects for your token
      const allCoins = await client.getCoins({
        owner: account.address,
        coinType:
          "0x668bfb1d5a440dcc255433726f054d8d0e4619493f014dfd56d737bec9d0e78f::xyle_token::XYLE_TOKEN",
      });

      // console.log("All coin objects:", allCoins.data);

      const tx = new Transaction();

      // Merge all coins first, then split the amount you need
      if (allCoins.data.length > 1) {
        const primaryCoin = allCoins.data[0].coinObjectId;
        const coinsToMerge = allCoins.data
          .slice(1)
          .map((coin) => coin.coinObjectId);

        tx.mergeCoins(
          tx.object(primaryCoin),
          coinsToMerge.map((id) => tx.object(id))
        );

        // Now split from the merged coin
        const [transferCoin] = tx.splitCoins(tx.object(primaryCoin), [
          amountInBaseUnits,
        ]);

        tx.transferObjects(
          [transferCoin],
          "0xa180e8ec28603cba892d1505170abb7b2c5a87c5e7b61f0b0036419fe7f7ae4e"
        );
      } else {
        // Only one coin object
        const [transferCoin] = tx.splitCoins(
          tx.object(allCoins.data[0].coinObjectId),
          [amountInBaseUnits]
        );

        tx.transferObjects(
          [transferCoin],
          "0xa180e8ec28603cba892d1505170abb7b2c5a87c5e7b61f0b0036419fe7f7ae4e"
        );
      }

      signAndExecute(
        {
          transaction: tx,
          chain: "sui:testnet",
          account,
        },
        {
          onSuccess: (res) => {
            console.log("Transfer success:", res);
            setTxComplete(true);
            // alert("Swap Successful");
          },
          onError: (err) => {
            console.error("Transfer failed:", err);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleComplete = async (userId: string) => {
    // const success = convertXyleToUsdt(userId, Number(convertAmount));
    // if (success) {
    alert("Conversion successful!");

    if (!account) return;

    const result = await getWalletBalance(account?.address);

    if (result) {
      setXyleBalance(result);
    }
    setShowLoading(false);
  };

  useEffect(() => {
    const getBalanceFunc = async () => {
      if (!account) {
        return;
      }
      const result = await getWalletBalance(account?.address);

      if (result) {
        setXyleBalance(result);
      }

      console.log(result);
    };

    getBalanceFunc();
  }, [txComplete]);

  useEffect(() => {
    const getCoinObjectId = async () => {
      if (!account) {
        alert("Connect Wallet");
        return;
      }
      const result = await getCoins(client, account?.address);
      setCoinId(result);
      console.log("Use Effect to get coin worked", result);
    };

    getCoinObjectId();
  }, [account]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">XYLE Off-Ramp</h2>
        {/* <Button
          variant="outline"
          size="sm"
          className="bg-gray-800 border-gray-700 text-white"
        >
          Convert XYLE to Fiat
        </Button> */}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h3 className="text-lg font-medium text-white">
              Your XYLE Balance
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-white">
                  {isBalanceLoading ? (
                    <p>Loading balance...</p>
                  ) : (
                    <p>
                      Token Balance:{" "}
                      {/* {Number(tokenBalance?.formatted || 0).toFixed(6)} */}
                      {xyleBalance}
                    </p>
                  )}
                </div>

                <div className="text-gray-400">XYLE</div>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Eye className="h-5 w-5" />
                <span className="sr-only">Show/Hide Balance</span>
              </Button>
            </div>

            <div className="text-gray-400">
              = ${Number(xyleBalance * 138).toFixed(2)} USD
            </div>
            <div className="text-sm text-gray-400">
              Fixed Rate: $138 USD per XYLE
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white"
              >
                <History className="mr-2 h-4 w-4" />
                View History
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-800 mt-4">
              <h4 className="font-medium mb-2 text-white">
                XYLE Token Details
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Token Type:</div>
                <div className="text-right text-white">
                  Security Token (PMA)
                </div>
                <div className="text-gray-400">Total Supply:</div>
                <div className="text-right text-white">3,200,000 XYLE</div>
                <div className="text-gray-400">Fixed Price:</div>
                <div className="text-right text-white">$138.00 USD</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h3 className="text-lg font-medium text-white">
              Convert XYLE to Fiat
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 text-white">
                <Label>From</Label>
                <div className="text-sm text-gray-400">
                  Available Balance: {Number(xyleBalance).toFixed(6)} XYLE
                </div>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  value={convertAmount}
                  className="bg-gray-800 border-gray-700 text-white pr-24"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                      setConvertAmount((Number(value) || 0).toString());
                    }
                  }}
                  inputMode="decimal"
                  pattern="[0-9]*"
                  step="any"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <div className="bg-gray-700 text-white px-3 h-full flex items-center rounded-r-md">
                    <span className="mr-2">×</span>
                    <span>XYLE</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-right mt-1 text-gray-400">
                ≈ ${Number(convertAmount) * 138}
              </div>
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
              <div className="flex justify-between mb-2 text-white">
                <Label>To</Label>
                <div className="text-sm text-gray-400">
                  Receiving ${Number(convertAmount) * 138}
                </div>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  value={Number(convertAmount) * 138}
                  readOnly
                  className="bg-gray-800 border-gray-700 text-white pr-24"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button
                    variant="ghost"
                    className="h-full rounded-l-none border-l border-gray-700 px-3 text-white"
                  >
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
                      className=" h-4 w-4"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-white">Payout Method</h4>

              <RadioGroup defaultValue="bank">
                <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-md text-white">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">Bank Account (ACH)</Label>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-md text-white">
                  <RadioGroupItem value="wire" id="wire" />
                  <Label htmlFor="wire">Wire Transfer</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="flex items-center text-white">
                <div className="mr-1">Rate</div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-gray-400"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-white">1 XYLE = 138 USD</div>
            </div>

            <Button
              className="w-full bg-gray-700 hover:bg-gray-600 text-white"
              onClick={() => handleConvert()}
            >
              Convert to Fiat
            </Button>
          </CardContent>
        </Card>
      </div>

      <XyleLoadingOverlay
        isVisible={showLoading}
        onComplete={() => handleComplete(userList[0].id)}
        amount={Number(convertAmount)}
        usdValue={Number(convertAmount) * 138}
        rate={138}
        type="off-ramp"
      />
    </div>
  );
}
