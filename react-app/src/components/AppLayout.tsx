import { Outlet } from "react-router"
import Menu from "./Menu"
import { Box } from "@mui/material"
import Footer from "./Footer"

const AppLayout = () => {
    return (<>
        <Menu />
        <Box    sx={{ marginTop: 10, padding: 2 }}>
            <Outlet />
        </Box>
        <Footer />
    </>)
}
export default AppLayout