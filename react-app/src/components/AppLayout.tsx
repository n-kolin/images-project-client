import { Outlet } from "react-router"
import Menu from "./Menu"
import { Box } from "@mui/material"
import Footer from "./Footer"
import { useEffect } from "react"

const AppLayout = () => {
    useEffect(() => {
        const script = document.createElement("script")
    
        script.type = "text/javascript"
        script.src = "https://bringthemhomenow.net/1.3.0/hostages-ticker.js"
        script.setAttribute("integrity", "sha384-MmP7bD5QEJWvJccg9c0lDnn3LjjqQWDiRCxRV+NU8hij15icuwb29Jfw1TqJwuSv")
        script.setAttribute("crossorigin", "anonymous")
    
        document.head.appendChild(script)
    
        return () => {
          document.head.removeChild(script)
        }
      }, [])
    return (<>
        <Menu />
        <Box sx={{ marginTop: 10, padding: 2 }}>
            <Outlet />
        </Box>

        <div id="bthn" lang="en"></div>
        
        <Footer />
    </>)
}
export default AppLayout