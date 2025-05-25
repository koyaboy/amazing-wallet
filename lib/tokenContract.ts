import { parseEther, parseUnits, formatEther, formatUnits } from "viem";
import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { bsc } from "wagmi/chains";

// Replace with your actual token contract address on BSC mainnet
export const TOKEN_CONTRACT_ADDRESS =
  "0xBd593b841c8fA31fc7d0ad3436e65DDbAc495F8a";

// Standard ERC20 ABI with mintable functionality
export const TOKEN_ABI = [
  // Read functions
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Hook to get token balance
// export function useTokenBalance(address: string | undefined) {
//   const { data, isError, isLoading, refetch } = useReadContract({
//     address: TOKEN_CONTRACT_ADDRESS,
//     abi: TOKEN_ABI,
//     functionName: "balanceOf",
//     args: address ? [address] : undefined,
//     query: {
//       enabled: !!address,
//     },
//   });

//   const { data: decimals } = useReadContract({
//     address: TOKEN_CONTRACT_ADDRESS,
//     abi: TOKEN_ABI,
//     functionName: "decimals",
//     query: {
//       enabled: !!address,
//     },
//   });

//   // Format the balance with the correct number of decimals
//   const formattedBalance =
//     data && decimals ? formatUnits(data, Number(decimals)) : "0";

//   return {
//     balance: data,
//     formattedBalance,
//     isError,
//     isLoading,
//     refetch,
//   };
// }

// Hook to buy tokens (using mint function)
export function useBuyToken() {
  const { data: hash, isPending, isError, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const buyToken = async (to: string, amount: number) => {
    try {
      // Use a fixed number of decimals (typically 18 for most tokens)
      // or fetch it from a separate API endpoint if needed
      const decimals = 18;

      const tokenAmount = parseUnits(amount.toString(), decimals);

      writeContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: "mint",
        args: [to, tokenAmount],
        chainId: bsc.id,
      });

      return { success: true };
    } catch (error) {
      console.error("Error buying token:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  return {
    buyToken,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
  };
}

// Hook to sell tokens (using transfer function to send tokens back to contract or treasury)
export function useSellToken() {
  const { data: hash, isPending, isError, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Replace with your treasury or burn address
  const TREASURY_ADDRESS = "0xD7bd0617194250d42c9A1aa00A154408d9630565";

  const sellToken = async (from: string, amount: number) => {
    try {
      // Use a fixed number of decimals (typically 18 for most tokens)
      // or fetch it from a separate API endpoint if needed
      const decimals = 18;

      const tokenAmount = parseUnits(amount.toString(), decimals);

      writeContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: "transfer",
        args: [TREASURY_ADDRESS, tokenAmount],
        chainId: bsc.id,
      });

      return { success: true };
    } catch (error) {
      console.error("Error selling token:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  return {
    sellToken,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
  };
}
