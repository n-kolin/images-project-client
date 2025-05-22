import { createHashRouter } from "react-router";
import AppLayout from "./components/AppLayout";
import UploadImage from "./components/file/UploadImage";

import Update from "./components/user/Update";
import AllFiles from "./components/image/AllFiles";
import About from "./components/About";
import FramePreview from "./components/framing/FramePreview.";
import Canvas from "./components/canvas/Canvas";
// import SignupForm from "./components/canvas/SSS";
import ImageEditor from "./components/editor/ImageEditor";
// import AiEditor from "./components/editor-ai/AiEditor";
import { ImageEditorProvider } from "./context/ImageEditorContext";

export const router = createHashRouter([
    {
        path: '/',
        element:
        
          // <AppLayout/> ,
          <ImageEditor />,
        children: [
            { path: 'update', element: <Update/>, },
            { path: 'about', element: <About/>, },
            { path: '/', element: <About/>, },
            { path: 'upload', element: <UploadImage /> },
            { path: 'all-files', element: <AllFiles /> },
            { path: 'editor-cop-1205', element: <ImageEditor /> },
            { path: 'frame', element: 
            // <Gallery /> 
            <Canvas />
        },
            { path: 'create', element: <FramePreview/> },
            // { path: 'editor-ai', element: <AiEditor imageUrl='https://img.freepik.com/free-photo/child-perspective-motorcar-generic-race_1232-3545.jpg?uid=R150112249&ga=GA1.1.1129303057.1731009829&semt=ais_hybrid&w=740'/> },
            
            // { path: 'update', element: <UpdateDetails /> },
            // { path: 'all-recipes/:id?', element: <AllRecipes /> },
            {path:'gpt-test',element:
                // <ImageEditorProvider>

            <ImageEditor/>
              //  </ImageEditorProvider>
        }

        ]
    }
]);