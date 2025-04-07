import { Box, Typography, Button, Container } from '@mui/material';

const About = () => {
    const url = "https://img.freepik.com/premium-photo/low-angle-view-chandelier_1048944-12765396.jpg?uid=R150112249&ga=GA1.1.1129303057.1731009829&semt=ais_hybrid"
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
                        mt: 25,
                        position: 'relative',
                        width: '100%',
                        height: '400px',
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
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 15,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="h2" component="h1" sx={{ color:'#445', fontWeight: 'bold', mb: 2 }}>
                            Welcome to our image upload service 
                        </Typography>


                    </Box>
                {/* </Box> */}

            </Box>
        </Container>
        </>
    );
};

export default About;