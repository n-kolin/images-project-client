import React, { useState } from 'react';
import { useImageEditorContext } from '../../../context/ImageEditorContext';

const BackgroundTool: React.FC = () => {
  const { setImageBackground } = useImageEditorContext();
  const [imageUrl, setImageUrl] = useState('');

  const applyBackground = () => {
    if (imageUrl.trim() !== '') {
      setImageBackground(imageUrl);
    }
  };

  return (
    <div>
      <h3>Background Tool</h3>
      <input
        type="url"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button onClick={applyBackground}>Set Background</button>
    </div>
  );
};

export default BackgroundTool;