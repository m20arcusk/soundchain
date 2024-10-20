import clientConfig from "@/config/clientConfig";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";


// ** CHANGE THIS FILE TO BE INCREMENT FUNDING **

export const useFundProject = () => {
  const { sponsorAndExecuteTransactionBlock, address } = useCustomWallet();

  const handleExecute = async (
    id: string,
    amount: number
  ): Promise<SuiTransactionBlockResponse> => {
    const recipient = address!;

    const txb = new Transaction();

    txb.moveCall({
      arguments: [txb.object(id), txb.pure.u64(amount)],
      target: `${clientConfig.PACKAGE_ID}::soundchain::invest`,
    });

    return await sponsorAndExecuteTransactionBlock({
      tx: txb,
      network: clientConfig.SUI_NETWORK_NAME,
      includesTransferTx: true,
      allowedAddresses: [recipient],
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    })
      .then((resp) => {
        console.log(resp);
        console.log("now sending coins");
        const [coin] = txb.splitCoins(txb.gas, [100]);
        txb.transferObjects([coin], id);
        return resp;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  };

  return { handleExecute };
};
