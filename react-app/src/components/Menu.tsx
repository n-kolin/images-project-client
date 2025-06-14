import { Link } from "react-router"
import Auth from "./user/Auth"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import { Home, Info, Files, Settings } from "lucide-react"
import "../css/Menu.css"

const Menu = () => {
  const currentUser = useSelector((state: StoreType) => state.auth.currentUser)

  return (
    <>
      <header className="modern-header">
        <div className="bg-animation">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>

        <div className="header-content">
          <div className="logo-container">
            <div className="logo-wrapper">
              <div className="logo-icon">
                <img src="/logo.gif" alt="Logo" className="logo-img" />
                <div className="logo-inner"></div>
              </div>
              <h1 className="logo-text">
                <span className="logo-main">Image</span>
                <span className="logo-accent">Editor</span>
              </h1>
            </div>
          </div>

          <nav className="main-navigation">
            <div className="nav-container">
              <Link to="/" className="nav-item">
                <Home size={16} className="nav-icon" />
                <span className="nav-text">Home</span>
                <div className="nav-underline"></div>
              </Link>

              <Link to="/about" className="nav-item">
                <Info size={16} className="nav-icon" />
                <span className="nav-text">About</span>
                <div className="nav-underline"></div>
              </Link>

              {/* {
                        currentUser &&
                        <Link to='/upload' className="nav-item">
                            <Upload size={16} className="nav-icon" />
                            <span className="nav-text">Upload File</span>
                            <div className="nav-underline"></div>
                        </Link>
                    } */}

              {currentUser && (
                <Link to="/files" className="nav-item">
                  <Files size={16} className="nav-icon" />
                  <span className="nav-text">All Files</span>
                  <div className="nav-underline"></div>
                </Link>
              )}

              {currentUser && (
                //  (currentUser.role === 'Admin') &&
                <Link to="https://image-editor-manager.onrender.com" className="nav-item">
                  <Settings size={16} className="nav-icon" />
                  <span className="nav-text">Manager</span>
                  <div className="nav-underline"></div>
                </Link>
              )}
            </div>
          </nav>

          <div className="auth-container">
            <Auth />
          </div>
        </div>
      </header>
    </>
  )
}

export default Menu
