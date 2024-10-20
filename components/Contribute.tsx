import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Counter from '@/components/CountContribute';

interface ContributeProps {
    projectTitle: string; // Prop for the project title
    completionPercentage: number; // Prop for the completion percentage
}

const Contribute: React.FC<ContributeProps> = ({ projectTitle, completionPercentage }) => {
    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column', // Stack content vertically
                borderRadius: '20px',
                border: '3px solid black',
                backgroundColor: '#434343',
                padding: '5vh',
                width: 600,
                alignItems: 'center', // Center children horizontally
            }}
        >
            <Typography
                gutterBottom
                sx={{ textAlign: 'center' }}
                variant="h4"
                component="div"
                color='white'
                fontFamily={'Verdana'}
            >
                <b>{projectTitle}</b>
            </Typography>

            <Box display="flex" alignItems="center" sx={{ gap: 1, width: '100%' }}>
                <Typography
                    gutterBottom
                    variant="body1"
                    component="div"
                    color='white'
                    fontFamily={'Verdana'}
                    paddingTop={0.5}
                >
                    Goal:
                </Typography>
                <Box sx={{ width: '100%', position: 'relative', border: '1px solid black', borderRadius: 5, overflow: 'hidden' }}>
                    <LinearProgress
                        variant="determinate"
                        value={completionPercentage}
                        sx={{
                            height: 15,
                            backgroundColor: 'white', // Background color of the bar
                            borderRadius: 5,
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#AAF5FF', // Color of the progress bar
                                borderRadius: '20px'
                            },
                        }}
                    />
                    <Typography
                        sx={{
                            position: 'absolute',
                            right: '8px', // Align to the right
                            top: '50%', // Center vertically
                            transform: 'translateY(-50%)', // Adjust positioning to center text
                            fontSize: '12px',
                            fontFamily: 'Verdana',
                            color: 'black'
                        }}
                    >
                        {completionPercentage}/100 SUI
                    </Typography>
                </Box>
            </Box>

            <Typography
                gutterBottom
                sx={{ textAlign: 'center' }} // Centered text
                variant="body2"
                component="div"
                color='#E3FCFF'
                fontFamily={'Verdana'}
            >
                For every 10 SUI in support receive:<br />
                <b>5%</b> Ownership Share + <b>10%</b> Royalties
            </Typography>

            <Counter />

            <Box display="flex" justifyContent="center" alignItems="center" paddingTop="2vh">
                <Button
                    variant="contained"
                    sx={{
                        fontFamily: 'Verdana',
                        color: "black",
                        backgroundColor: "white",
                        borderRadius: '20px',
                        paddingX: 8
                    }}
                >
                    <b>Contribute with SUI</b>
                </Button>
            </Box>
        </Card>
    );
}

export default Contribute;