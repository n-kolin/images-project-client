import { useState } from "react"
import { Modal, Box, Button } from "@mui/material"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import { modalStyle } from "../../styles/ModalStyle"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../../store/store"
import { clearCurrentUser } from "../../store/authSlice"
import { useNavigate } from "react-router"
import { LogIn, UserPlus, LogOut, Settings } from "lucide-react"
import "../../css/Auth.css"

const Auth = () => {
  const [open, setOpen] = useState(false)
  const [isSignIn, setIsSignIn] = useState(false)

  const handleClose = () => setOpen(false)
  const toggleForm = () => setIsSignIn(!isSignIn)

  const handleSuccess = () => {
    setOpen(false)
  }

  const dispatch = useDispatch<AppDispatch>()

  const navigate = useNavigate()
  const signOut = () => {
    navigate("/")
    dispatch(clearCurrentUser())
    sessionStorage.removeItem("accessToken")
  }

  const currentUser = useSelector((state: StoreType) => state.auth.currentUser)

  const update = () => {
    navigate("/update")
  }

  return (
    <div className="auth-wrapper">
      {!currentUser ? (
        <>
          <Button
            className="auth-styled-button"
            onClick={() => {
              setOpen(true)
              setIsSignIn(true)
            }}
          >
            <LogIn size={16} className="auth-button-icon" />
            <span className="auth-button-text">Sign In</span>
            <div className="auth-button-underline"></div>
          </Button>

          <Button
            className="auth-styled-button"
            onClick={() => {
              setOpen(true)
              setIsSignIn(false)
            }}
          >
            <UserPlus size={16} className="auth-button-icon" />
            <span className="auth-button-text">Sign Up</span>
            <div className="auth-button-underline"></div>
          </Button>
        </>
      ) : (
        <>
          <Button
            className="auth-styled-button"
            onClick={() => {
              signOut()
            }}
          >
            <LogOut size={16} className="auth-button-icon" />
            <span className="auth-button-text">Sign Out</span>
            <div className="auth-button-underline"></div>
          </Button>

          <Button
            className="auth-styled-button"
            onClick={() => {
              update()
            }}
          >
            <Settings size={16} className="auth-button-icon" />
            <span className="auth-button-text">Update</span>
            <div className="auth-button-underline"></div>
          </Button>
        </>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
      >
        
        <Box sx={modalStyle}>
          {isSignIn ? (
            <div>
              <SignIn onSuccess={handleSuccess} />
              <p>
                Don't have an account? <Button onClick={toggleForm}>Sign Up</Button>
              </p>
            </div>
          ) : (
            <div>
              <SignUp onSuccess={handleSuccess} />
              <p>
                Already have an account? <Button onClick={toggleForm}>Sign In</Button>
              </p>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  )
}

export default Auth
