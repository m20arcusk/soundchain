import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

const Counter: React.FC = () => {
    const [count, setCount] = useState(10);

    const handleIncrement = () => {
        setCount(prevCount => prevCount + 10);
    };

    const handleDecrement = () => {
        setCount(prevCount => Math.max(prevCount - 10, 10));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center', // Center the counter block in its parent
                padding: '20px',
            }}>
            <Button variant="contained"
            sx={{
                fontFamily: 'Verdana',
                color: "black",
                backgroundColor: "white",
                borderRadius: 0,
            }}
            disableElevation onClick={handleDecrement} disabled={count === 0}>
                -
            </Button>
            <Box
                className="counter-background"
                sx={{
                    display: 'flex',
                    alignItems: 'center', // Center items vertically
                    padding: '8px',
                    width: '63.5px',
                    backgroundColor: 'white', // Background color matching Material-UI components
                    justifyContent: 'center', // Center text horizontally
                    
                }}
            >
                <span>{count}&nbsp;SUI</span>
            </Box>
            <Button variant="contained" disableElevation
            sx={{
                fontFamily: 'Verdana',
                color: "black",
                backgroundColor: "white",
                borderRadius: 0,
            }}
            onClick={handleIncrement}>
                +
            </Button>
        </Box>
    );
};

export default Counter;
