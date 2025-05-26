import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";

// create a client connected to devnet
export const client = new SuiClient({ url: getFullnodeUrl("devnet") });

//Move call function to buy XYLE
const buyXYLEOnSUi = async (amount: number, address: string) => {
  const tx = new Transaction();
  const keypair = new Ed25519Keypair();

  const packageObjectId = ""; //replace with package ID from smart contract. Ask dev

  const InitialCoinType = ""; //  type name for the first generic that is to be converted e.g USDC
  const SecondCoinType = ""; //  type name for the second generic to be converted to e.g XYLE

  tx.moveCall({
    target: `${packageObjectId}::module_name::function_name`,

    arguments: [
      tx.pure.u64(amount),
      tx.pure.address(address), // address gotten from useWallet hook provided by sui
    ],
    typeArguments: [InitialCoinType, SecondCoinType],
  });
  try {
    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    });

    alert("XYLE Purchase Successful");
  } catch (error) {
    alert("Failed to Purchase XYLE");
  }
};

//get transactions for UI
const getTransactions = async () => {
  const txn = await client.queryTransactionBlocks({
    filter: {
      FromAddress: "", //address of current user wallet
    },
    options: {
      showEffects: true,
      showInput: true,
    },
    limit: 10,
  });
};
