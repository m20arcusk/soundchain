import React, { useEffect, useState } from 'react'; // Added useState import
import { motion, AnimatePresence } from 'framer-motion';
import CardFlip from '@/components/CardFlip';
import { useFundProject } from "@/hooks/useFundProject";
// import { useResetCounterTransaction } from "@/hooks/useResetCounterTransaction";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { SuiObjectData } from '@mysten/sui/client';
import { useSuiClient, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

// Represents the shared artist object
type Artist = {
  id: string;                  // Unique identifier (UID)
  owner: string;               // Address of the owner
  name: string;
  audioLink: string,
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

// Define props for Flashcards
interface FlashcardsProps {
    id: string;
    currentCardIndex: number;
    cardData: string[];
    handleNext: () => void;
    handlePrev: () => void;
}

const Flashcards: React.FC<FlashcardsProps> = ({ currentCardIndex, cardData }) => {
    const [direction, setDirection] = useState<'left' | 'right'>('left');
    const { address, isConnected } = useCustomWallet();
    const suiClient = useSuiClient();
    const id = cardData[currentCardIndex];
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
    const audioArray = artistData?.audioLink;
    const artistGoal = artistData?.goal;
    const artistFunded = artistData?.funding;

    let artistName = "nothing";
    let audioLink = "nothing";
    console.log(artistGoal)
    console.log(artistFunded)
    let progress = artistGoal && artistFunded? artistFunded / artistGoal : 0;
    // Check if nameArray is defined and is an array
    if (Array.isArray(nameArray)) {
        artistName = numbersToString(nameArray);
        audioLink = numbersToString(audioArray);
        console.log("Artist Name:", artistName); // Output the corresponding string
        console.log("Audio Link:", audioLink);
        console.log("progress: " + progress);
    } else {
        console.log("No valid artist name found. Type of nameArray:", typeof nameArray);
    }

    // You don't need internal next/prev, direction is updated based on current card index
    const variants = {
        hidden: (dir: string) => ({
            x: dir === 'left' ? 100 : -100, // Start off-screen based on direction
            opacity: 0,
        }),
        visible: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: string) => ({
            x: dir === 'left' ? -100 : 100, // Exit off-screen based on direction
            opacity: 0,
        }),
    };

    return (
        <div>
            <AnimatePresence mode="wait"> {/* Updated here */}
                <motion.div
                    key={currentCardIndex} // Key helps with remounting the component on index change
                    custom={direction}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.5 }}
                >
                    <CardFlip
                        projectTitle={artistName}
                        audioLink={audioLink}
                        completionPercentage={progress}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Flashcards;

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