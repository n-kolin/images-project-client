import { createBrowserRouter } from "react-router";
import AppLayout from "./components/AppLayout";
import UploadImage from "./components/file/UploadImage";
import Download from "./components/file/Download";
import SignUp from "./components/user/SignUp";
import Update from "./components/user/Update";
import SignIn from "./components/user/SignIn";
import AllFiles from "./components/image/AllFiles";
import About from "./components/About";

export const router = createBrowserRouter([
    {
        path: '/',
        element:
        
           <AppLayout/> ,
        children: [
            { path: 'update', element: <Update/>, },
            { path: 'about', element: <About/>, },
            { path: '/', element: <About/>, },
            { path: 'upload', element: <UploadImage /> },
            { path: 'all-files', element: <AllFiles /> },
            // { path: 'update', element: <UpdateDetails /> },
            // { path: 'all-recipes/:id?', element: <AllRecipes /> },

        ]
    }
]);