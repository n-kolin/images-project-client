import { createHashRouter } from "react-router";
import AppLayout from "./components/AppLayout";
import UploadImage from "./components/file/UploadImage";

import Update from "./components/user/Update";
import AllFiles from "./components/image/AllFiles";
import About from "./components/About";
import ImageEditor from "./components/editor/ImageEditor";
import Home from "./components/Home";

export const router = createHashRouter([
    {
        path: '/',
        element:
          <AppLayout/> ,
        children: [
            { path: 'about', element: <About/>, },
            { path: '/', element: <Home/>, },
            { path: 'upload', element: <UploadImage /> },
            { path: 'files', element: <AllFiles /> },
            {path:'edit',element:
                // <ImageEditorProvider>

            <ImageEditor/> 
              //  </ImageEditorProvider>
        }

        ]
    }
]);