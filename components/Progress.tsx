import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

interface ProgressProps {
    completionPercentage: number;
}

const Progress: React.FC<ProgressProps> = ({ completionPercentage }) => {
    return (
        <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
            <Typography gutterBottom variant="body1" component="div" color='white' fontFamily={'Verdana'} paddingTop={0.5}>
                Goal:
            </Typography>
            <Box sx={{ width: '100%', border: '1px solid black', borderRadius: 5, overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', width: '100%', border: '1px solid black', borderRadius: 5, overflow: 'hidden' }}>
                    <LinearProgress
                        variant="determinate"
                        value={completionPercentage}
                        sx={{
                            height: 15,
                            backgroundColor: 'white',
                            borderRadius: 5,
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#AAF5FF',
                                borderRadius: '20px'
                            },
                        }}
                    />
                    {/* Centered text relative to the progress bar */}
                    <Typography
                        sx={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)', // Vertically center the text relative to the progress bar
                            fontSize: '12px',
                            fontFamily: 'Verdana',
                            color: 'black'
                        }}
                    >
                        {completionPercentage}/100 SUI
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default Progress;