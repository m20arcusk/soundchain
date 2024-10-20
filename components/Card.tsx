import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Box, LinearProgress } from '@mui/material';
import CustomAudioPlayer from '@/components/Music';
import Progress from '@/components/Progress';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface MultiActionAreaCardProps {
    projectTitle: string;
    audioLink: string;
    completionPercentage: number;
    onSupportClick: (e: React.MouseEvent<HTMLButtonElement>) => void; // Add the prop type for onSupportClick
}

const MultiActionAreaCard: React.FC<MultiActionAreaCardProps> = ({ projectTitle, audioLink, completionPercentage, onSupportClick }) => {
    return (
        <Card sx={{ display: 'flex', borderRadius: '20px', border: '3px solid black', backgroundColor: '#434343', width: 600 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: 1, backgroundColor: '#EEEEEE', padding: "2vh" }}>
                    <Typography gutterBottom sx={{ textAlign: 'center' }} variant="h4" component="div" color='grey' fontFamily={'Verdana'}>
                        <b>{projectTitle}</b>
                    </Typography>
                    <CustomAudioPlayer src={audioLink} />
                </Box>
                <Box sx={{ flex: 1, backgroundColor: '#434343', padding: "2vh" }}>
                    <Progress completionPercentage={completionPercentage}/>
                    <Typography variant="body2" color='#E3FCFF' fontFamily={'Verdana'} padding={1}>
                        Support me to allow me to produce this professionally. Support badges are starting at <b>10 SUI</b>.
                    </Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" paddingTop="2vh">
                        <Button
                            variant="contained"
                            endIcon={<FavoriteIcon />}
                            sx={{ fontFamily: 'Verdana', color: "black", backgroundColor: "white", borderRadius: '20px', paddingX: 8 }}
                            onClick={onSupportClick} // Attach the click handler here
                        >
                            <b>Support</b>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default MultiActionAreaCard;