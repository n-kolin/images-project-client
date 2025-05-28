import { Box, Typography, Button, Container } from '@mui/material';
import { useNotificationHelpers } from '../hooks/useNotification';
import { useEffect } from 'react';

const About = () => {
    const url = "../../public/welcome.gif"

    const { success, error, info } = useNotificationHelpers()

    useEffect(()=>{
        error("Welcome to File Manager", "Explore your files with ease!", { duration: 3000 })
    })
    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 8 }}>
                {/* <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 4,
                    padding: 4,
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            > */}

                <Box
                    sx={{
                        m: 0,
                        position: 'relative',
                        width: '100%',
                        height: '550px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2,
                        overflow: 'hidden',
                        backgroundImage: `url(${url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)',
                    }}
                >



                </Box>
            </Container>
            
            
        </>
    );
};

export default About;