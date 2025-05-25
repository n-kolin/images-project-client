import { Outlet } from "react-router"
import Menu from "./Menu"
import { Box } from "@mui/material"

const AppLayout = () => {
    return (<>
        <Menu />
        <Box    sx={{ marginTop: 25, padding: 2 }}>
            <Outlet />
        </Box>
    </>)
}
export default AppLayout