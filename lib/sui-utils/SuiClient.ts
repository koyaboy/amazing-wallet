import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Keypair } from "@mysten/sui/cryptography";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";

const packageObjectId =
  "0x668bfb1d5a440dcc255433726f054d8d0e4619493f014dfd56d737bec9d0e78f";

const MODULE_NAME = "xyle_token";
const TREASURY_CAP_ID =
  "0x89ef61702d95128c3456280112ff69c98b9f965c6fc600729f600ed6201f10e3";

// create a client connected to devnet
export const client = new SuiClient({ url: getFullnodeUrl("testnet") });

//Move call function to buy XYLE
export const buyXYLEOnSUi = async (amount: number, address: string) => {
  const tx = new Transaction();
  const keypair = new Ed25519Keypair();

  //replace with package ID from smart contract. Ask dev

  const InitialCoinType = ""; //  type name for the first generic that is to be converted e.g USDC
  const SecondCoinType =
    "0x668bfb1d5a440dcc255433726f054d8d0e4619493f014dfd56d737bec9d0e78f::xyle_token::XYLE_TOKEN"; //  type name for the second generic to be converted to e.g XYLE

  tx.moveCall({
    target: `${packageObjectId}::${MODULE_NAME}::function_name`,

    arguments: [
      tx.pure.u64(amount),
      tx.pure.address(address), // address gotten from  hook provided by sui
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
export const getTransactions = async (address: string | undefined) => {
  if (!address) {
    return;
  }

  const txn = await client.queryTransactionBlocks({
    filter: {
      FromAddress: address, //address of current user wallet
    },
    options: {
      showEffects: true,
      showInput: true,
    },
    limit: 10,
  });

  console.log(txn);
  return txn;
};

// export async function mintXyleToken({
//   signer,
//   amount,
//   recipient,
// }: {
//   signer: any; // from wallet

//   amount: number;
//   recipient: string;
// }) {
//   const keypair = new Ed25519Keypair();
//   const tx = new Transaction();

//   tx.moveCall({
//     target: `${packageObjectId}::${MODULE_NAME}::mint`,
//     arguments: [
//       tx.object(TREASURY_CAP_ID),
//       tx.pure.u64(amount),
//       tx.pure.address(recipient),
//     ],
//   });

//   const result = await signAndExecute({
//     signer: recipient,
//     transaction: tx,
//     options: {
//       showEffects: true,
//       showEvents: true,
//     },
//   });

//   console.log("This is the result", result);

//   return result;
// }

export function buildMintTransaction({
  amount,
  recipient,
}: {
  amount: number;
  recipient: string;
}) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageObjectId}::${MODULE_NAME}::mint`,
    arguments: [
      tx.object(TREASURY_CAP_ID),
      tx.pure.u64(amount),
      tx.pure.address(recipient),
    ],
  });

  return tx;
}

export const buildTransferTransaction = ({
  coinObjectId,
  recipient,
  amount,
}: {
  coinObjectId: string; // The coin you own of type Coin<XYLE_TOKEN>
  recipient: string;
  amount: number; // e.g., 100_000_000 for 1 XYLE (8 decimals)
}) => {
  const tx = new Transaction();

  const coin = tx.object(coinObjectId);

  // Split it to get the exact amount
  const [coinToSend] = tx.splitCoins(coin, [tx.pure.u64(amount)]);

  // Send to recipient
  tx.transferObjects([coinToSend], tx.pure.address(recipient));

  return tx;
};

export async function getWalletBalance(address: string) {
  const balance = await client.getBalance({
    owner: address,
    coinType:
      "0x668bfb1d5a440dcc255433726f054d8d0e4619493f014dfd56d737bec9d0e78f::xyle_token::XYLE_TOKEN", // for XYLE token
  });

  console.log("Balance in MIST:", balance.totalBalance);
  const balanceInSUI = Number(balance.totalBalance) / 1e8;
  console.log("Balance in SUI:", balanceInSUI);

  return balanceInSUI;
}
