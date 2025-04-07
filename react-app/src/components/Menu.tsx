import { AppBar, Box, colors, Toolbar, Typography } from "@mui/material"
import { Link } from "react-router"
import Auth from "./user/Auth"

const Menu = () => {
    const tabStyle = {
        textDecoration: 'none',
        border: '1px solid #92afae',
        margin: '3px',
        padding: '3px',
        borderRadius: '10px',
        paddingRight:'15px', paddingLeft:'15px', backgroundColor:'#fff'
    }
    return (<>

        <AppBar position="fixed" sx={{ backgroundColor: 'primary', paddingBottom: 2, paddingTop: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ marginLeft: 2, p: 2 }}>

                    <Auth />

                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                    <Link to='/' style={tabStyle}>
                        <Typography variant="h6">home</Typography>
                    </Link>

                    <Link to='/' style={tabStyle}>
                        <Typography variant="h6" >about</Typography>
                    </Link>

                    {
                        // state.id &&
                        <Link to='/upload' style={tabStyle}>
                            <Typography variant="h6" >upload file</Typography>
                        </Link>
                    }
                    <Link to='/all-files' style={tabStyle}>
                        <Typography variant="h6" >all files</Typography>
                    </Link>

                </Box>
            </Box>
        </AppBar>
    </>)
}
export default Menu