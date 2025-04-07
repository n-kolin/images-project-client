import { useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { modalStyle, styleButton } from '../../styles/ModalStyle';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../../store/store';
import { clearCurrentUser } from '../../store/authSlice';
import { useNavigate } from 'react-router';

const Auth = () => {
    const [open, setOpen] = useState(false);
    const [isSignIn, setIsSignIn] = useState(false);

    const handleClose = () => setOpen(false);
    const toggleForm = () => setIsSignIn(!isSignIn);


    const handleSuccess = () => {
        setOpen(false);
    }

    //log out
    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();
    const signOut = () => {
        navigate('/'); // ניתוב לעמוד הראשי
        dispatch(clearCurrentUser())
        sessionStorage.removeItem('accessToken');
    }


    //current user
    const currentUser = useSelector((state: StoreType) => state.auth.currentUser);




    const update = () => {
        navigate('/update')
    }

    return (
        <div>

            {!currentUser ? (
                <>
                    <Button sx={styleButton} onClick={() => {
                        setOpen(true);
                        setIsSignIn(true)
                    }}>
                        sign in
                    </Button>


                    <Button sx={styleButton} onClick={() => {
                        setOpen(true);
                        setIsSignIn(false)
                    }}>
                        sign up
                    </Button>
                </>
            ) : (
                <>
                    <Button sx={styleButton} onClick={() => {
                        signOut();
                    }}>
                        sign out
                    </Button>
                    {/* <Update /> */}

                    <Button sx={styleButton} onClick={() => {
                        update();
                    }}>
                        update
                    </Button>
                </>

            )
            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="auth-modal-title"
                aria-describedby="auth-modal-description"
            >
                {/* 
                X
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={() => { reset(); setOpen(false); }}
                            sx={{
                                borderRadius: '50%',
                                minWidth: '0',
                                height: '40px',
                                padding: '6px',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                }
                            }}
                        >
                            <Close />
                        </Button>
                    </Box>
                
                
                
                */}
                <Box sx={modalStyle}>
                    {isSignIn ? (
                        <div>
                            <p>Don't have an account? <Button onClick={toggleForm}>Sign Up</Button></p>
                            <SignIn onSuccess={handleSuccess} />
                        </div>
                    ) : (
                        <div>
                            <p>Already have an account? <Button onClick={toggleForm}>Sign In</Button></p>
                            <SignUp onSuccess={handleSuccess} />
                        </div>
                    )}
                </Box>
            </Modal>
        </div>
    );
};


export default Auth;