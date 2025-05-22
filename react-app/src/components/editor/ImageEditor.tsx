// import React from 'react';
// import { ImageEditorProvider } from '../../context/ImageEditorContext';
// import EditorPreview from './EditorPreview';
// import HistoryManager from './HistoryManager';
// import TextTool from './tools/Text';
// import RotateTool from './tools/Rotate';
// import BackgroundTool from './tools/Background';

// const ImageEditor: React.FC = () => {
//   return (
//     <ImageEditorProvider>
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//           <h1 style={{ textAlign: 'center' }}>Image Editor</h1>
//           <EditorPreview />
//           <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
//             <RotateTool />
//             <TextTool />
//             <BackgroundTool />
//           </div>
//           <HistoryManager />
//         </div>
//     </ImageEditorProvider>
//   );
// };

// export default ImageEditor;



// components/ImageEditor/ImageEditor.tsx

import React from 'react';
import EditorPreview from './EditorPreview';
import HistoryManager from './HistoryManager';

import AIDesignTool from './tools/AIDesignTool';
import { ImageEditorProvider } from '../../context/ImageEditorContext';

const ImageEditor: React.FC = () => {

  // const { setImageBackground } = useImageEditorContext();
  // const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // useEffect(() => {
  //   // קבלת ה-URL של התמונה מה-query parameters
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const imgUrl = searchParams.get('img-url');
    
  //   if (imgUrl) {
  //     setImageUrl(imgUrl);
  //     setImageBackground(imgUrl);
  //   }
  // }, [setImageBackground]);

  
  return (
    <ImageEditorProvider>
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ textAlign: 'center' }}>Image Editor</h1>
          <EditorPreview />
          <div style={{ margin: '20px 0' }}>
            <AIDesignTool />
          </div>
          {/* <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
            <RotateTool />
            <TextTool />
            <BackgroundTool />
          </div> */}
          <HistoryManager />
        </div>
     </ImageEditorProvider>
  );
};

export default ImageEditor;