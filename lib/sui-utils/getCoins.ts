import { SuiClient } from "@mysten/sui/client";

export const getCoins = async (client: SuiClient, recipient: string) => {
  const coins = await client.getCoins({
    owner: recipient,
    coinType:
      "0x668bfb1d5a440dcc255433726f054d8d0e4619493f014dfd56d737bec9d0e78f::xyle_token::XYLE_TOKEN",
  });

  return coins.data[0].coinObjectId;
};
