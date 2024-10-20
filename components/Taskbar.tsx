import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import Image from 'next/image';

const Taskbar: React.FC = () => {
  const handleGoogleSignIn = () => {
    console.log('Google Sign-In clicked');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
      <Toolbar 
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5vh 1vh 1vh', // Add horizontal padding
      }}>
        <Image
          src="/vectlogo.svg"
          alt="soundchain"
          width={80} 
          height={50}
        />
        <Button variant="contained"
          sx={{
            backgroundColor: '#444444',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
            borderRadius: '0.625rem',
            padding: '0.5rem 1rem',
            fontSize: '0.6rem', // Adjust font size for a smaller button
            fontFamily: 'Verdana', // Set font to Verdana
            fontWeight: 'bold', // Make the font bold
            textTransform: 'none',
        }}
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Taskbar;