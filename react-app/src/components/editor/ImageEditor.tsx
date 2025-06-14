import React from 'react';
import EditorPreview from './EditorPreview';

import AIDesignTool from './tools/AIDesignTool';
import { ImageEditorProvider } from '../../context/ImageEditorContext';

const ImageEditor = () => {

  return (
    <ImageEditorProvider>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', gap: '20px' }}>
          <div
            style={{ flex: 2 }}
          >
            <EditorPreview />
          </div>
          <div
            style={{ flex: 1 }}
          >
            <AIDesignTool />
          </div>
        </div>
      </div>
    </ImageEditorProvider>
  );
};

export default ImageEditor;