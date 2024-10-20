import clientConfig from "@/config/clientConfig";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

// ** Hook for creating a new artist **
export const useCreateArtistTransaction = () => {
  const { sponsorAndExecuteTransactionBlock, address } = useCustomWallet();

  const handleExecute = async (name: string, audioLink: string): Promise<SuiTransactionBlockResponse> => {
    const recipient = address!; // Ensure the user is authenticated

    console.log("Creating artist for:", recipient);
    // console.log("byte array:", nameBytes);

    const txb = new Transaction();

    txb.moveCall({
      target: `${clientConfig.PACKAGE_ID}::soundchain::create_artist`,
      arguments: [
        txb.pure.string(name), // incorporate audio link here
        txb.pure.string(audioLink)
      ],
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
        console.log("Artist created:", resp);
        return resp;
      })
      .catch((err) => {
        console.error("Error creating artist:", err);
        throw err;
      });
  };

  return { handleExecute };
};
