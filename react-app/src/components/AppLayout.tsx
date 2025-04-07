import { Outlet } from "react-router"
import Menu from "./Menu"

const AppLayout = () => {
    return (<>
        <Menu />
        <Outlet />
    </>)
}
export default AppLayout