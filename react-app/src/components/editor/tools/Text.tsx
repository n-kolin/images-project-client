import React, { useState } from 'react';
import { useImageEditorContext } from '../../../context/ImageEditorContext';

const TextTool: React.FC = () => {
  const { imageState, setImageState } = useImageEditorContext();
  const [text, setText] = useState('');
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState('#000000');

  const applyText = () => {
    setImageState({
      ...imageState,
      filters: {
        ...imageState.filters,
        textLayer: { text, x, y, fontSize, color },
      },
    });
  };

  return (
    <div>
      <h3>Text Tool</h3>
      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="number"
        placeholder="X position"
        value={x}
        onChange={(e) => setX(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Y position"
        value={y}
        onChange={(e) => setY(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Font size"
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <button onClick={applyText}>Apply</button>
    </div>
  );
};

export default TextTool;