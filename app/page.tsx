'use client';

import { useEffect, useState } from "react";
import { useCustomWallet } from "@/contexts/CustomWallet";
import ProfilePopover from "@/components/ProfilePopover";
import { CreateArtist } from "@/components/CreateArtist";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { GithubIcon } from "lucide-react";
import clientConfig from "@/config/clientConfig";
import Image from "next/image";
import Taskbar from "@/components/Taskbar";
import Flashcards from "@/components/Flashcard";
import { Box } from '@mui/material';
import { Artist } from "@/components/Artist";
import { useCreateArtistTransaction } from "@/hooks/useCreateArtist";
import { object } from "zod";
// import { useState } from 'react';

// const cardData = [
//   { projectTitle: "FEIN", audioLink: "/fein.mp3", completionPercentage: 30 },
//   { projectTitle: "HelloHacks", audioLink: "/fein.mp3", completionPercentage: 40 },
//   { projectTitle: "UX Open", audioLink: "/fein.mp3", completionPercentage: 50 },
// ];

// ** NEED TO ALSO UPDATE smart contract ** 
// upon website load, make 3 create calls to make an 'artist',
// update create() to take in some params, and update handler           
// include audio link field  
// * include the global client id as the first one in the array
// and store the id's returned in an array. pass the array if id's to flashcard
// ** will need to replace the global id with one with the right fields 
// id array would replace cardData
// fetch and access the artist info using cardFlip, and know which one through
// currentIndex


export default function Home() {
  const [waitingForTxn, setWaitingForTxn] = useState(false);
  // card data is a list of strings which represent the id's 
  const [cardData, setCardData] = useState<string[]>([]);
  const { isConnected } = useCustomWallet();
  const [ArtistId, setArtist] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { handleExecute } = useCreateArtistTransaction();

  useEffect(() => {
    const hash = window.location.hash.slice(1); // takes the hash and then 
    if (isValidSuiObjectId(hash)) { // if valid sui object, sets the counter
      setArtist(hash);
    }
    // create three
    if (isConnected) {
      create("shake it down", "/tswift.mp3");
      create("focus on me", "/attention.mp3");
      // create("best song ever", "/hellohacks.wav");
    }

  }, []);

  async function create(name: string, audioLink: string) {
    setWaitingForTxn(true);

    const txn = await handleExecute(name, audioLink);

    console.log("txn", txn);

    const objectId = txn.effects?.created?.[0]?.reference?.objectId; // access the object that is created

    if (objectId) {
      // onCreated(objectId);
      // id to list
      setCardData([...cardData, objectId])
    }

    setWaitingForTxn(false);
  }

  const handleNext = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cardData.length);
  };

  const handlePrev = () => {
    setCurrentCardIndex((prevIndex) =>
      (prevIndex - 1 + cardData.length) % cardData.length
    );
  };

  return (
    <div className="">
      <ProfilePopover />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundImage: 'url("/background.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1,
          }}
        >
          <Taskbar />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          <Image
            src="/leftarrow.png"
            alt="Previous"
            width={70}
            height={70}
            onClick={handlePrev}
            style={{ cursor: 'pointer', marginRight: '10vh' }}
          />

          {/* Pass the currentCardIndex and the handler functions to Flashcards */}
          <Flashcards
            id={clientConfig.GLOBAL_COUNTER_ID}
            currentCardIndex={currentCardIndex}
            cardData={cardData}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />

          <Image
            src="/rightarrow.png"
            alt="Next"
            width={70}
            height={70}
            onClick={handleNext}
            style={{ cursor: 'pointer', marginLeft: '10vh' }}
          />
        </Box>
      </Box>
    </div>
  );
}
