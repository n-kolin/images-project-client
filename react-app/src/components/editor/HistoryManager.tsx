import React from 'react';
import { useImageEditorContext } from '../../context/ImageEditorContext';

const HistoryManager: React.FC = () => {
  const { undo, redo, canUndo, canRedo } = useImageEditorContext();

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>
    </div>
  );
};

export default HistoryManager;