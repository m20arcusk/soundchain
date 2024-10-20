import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useFundProject } from "@/hooks/useFundProject";
// import { useResetCounterTransaction } from "@/hooks/useResetCounterTransaction";
import { useCustomWallet } from "@/contexts/CustomWallet";

// Represents the shared artist object
type Artist = {
  id: string;                  // Unique identifier (UID)
  owner: string;               // Address of the owner
  name: string;
  funding: number,
  finished: boolean,     
  goal: number,           // Name of the artist
  investments: Investment[]          // Array of tracks created by the artist
};

// Represents an investment made by a buyer
type Investment = {
  id: string,
  investor: string; // Address of the investor
  funded: number
};

export function Artist({ id }: { id: string }) {
  const { address, isConnected } = useCustomWallet();
  const suiClient = useSuiClient();
  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  // refetch the data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const [waitingForTxn, setWaitingForTxn] = useState("");

  const { handleExecute: handleFund } = useFundProject();

  const executeMoveCall = async (method: "fund") => {
    setWaitingForTxn(method);

    const tx = new Transaction();
    console.log("executing...");
    const fundTxn = await handleFund(id, 2);
      suiClient
        .waitForTransaction({ digest: fundTxn.digest })
        .then(async () => {
          await refetch();
          setWaitingForTxn("");
        });
  };

  if (isPending) return <span>Loading...</span>;

  if (error) return <span>Error: {error.message}</span>;

  if (!data.data) return <span>Not found</span>;

  const ownedByCurrentAccount = getArtistFields(data.data)?.owner === address;

  console.log("ownedByCurrentAccount", ownedByCurrentAccount);

  function numbersToString(numArray: number[]): string {
    // Convert each number to its corresponding character
    const result = numArray.map(num => String.fromCharCode(num)).join("");
    return result; // Return the resulting string
}

// Get the artist name field
const artistData = getArtistFields(data.data);
const nameArray = artistData?.name; // Assuming this is an array

console.log("nameArray:", nameArray); // Log the value of nameArray
let artistName = "nothing";
// Check if nameArray is defined and is an array
if (Array.isArray(nameArray)) {
    artistName = numbersToString(nameArray);
    console.log("Artist Name:", artistName); // Output the corresponding string
    artistData?.investments.forEach(element => {
      console.log("funded: " + element.investor);
    });
} else {
    console.log("No valid artist name found. Type of nameArray:", typeof nameArray);
}

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Counter {id.slice(0, 8)}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {artistName ?
          <span>Name: {artistName}</span> :
          <span> No name found </span>}
          <span>Funding: {artistData?.funding}</span>
          <span>Goal: {artistData?.goal}</span>
          {/* <span>Investments: {artistData?.investments}</span> */}
        <div className="flex flex-row justify-around items-center gap-2">
          <Button
            onClick={() => executeMoveCall("fund")}
            disabled={waitingForTxn !== "" || !isConnected}
          >
            {waitingForTxn === "fund" ? (
              <ClipLoader size={20} />
            ) : (
              isConnected ? "fund" : "Sign in to fund"
            )}
          </Button>
          {/* {ownedByCurrentAccount ? (
            <Button
              onClick={() => executeMoveCall("reset")}
              disabled={waitingForTxn !== ""}
            >
              {waitingForTxn === "reset" ? <ClipLoader size={20} /> : "Reset"}
            </Button>
          ) : null} */}
        </div>
      </CardContent>
    </Card>
  );
}

function getArtistFields(data: SuiObjectData): Artist | null {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  // Cast to the Artist type if the shape matches
  const artist = data.content.fields as Artist;

  // // Ensure 'tracks' property exists and is an array
  // if (!Array.isArray(artist.tracks)) {
  //     throw new Error("Tracks is not an array");
  // }

  return artist;
}
