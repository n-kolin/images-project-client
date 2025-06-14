import React, { createContext, useContext, useState } from 'react';

interface TextLayer {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
}

interface Border {
  width: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
}

interface Filter {
  brightness?: number; 
  contrast?: number;   
  saturation?: number; 
  blur?: number;       
  grayscale?: number;  
}

interface Overlay {
  color: string;      
  blendMode: 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion';
}

interface Transform {
  rotation?: number;  
  scale?: number;     
  flipX?: boolean;
  flipY?: boolean;
}

interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Shadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

interface FilterState {
  textLayer?: TextLayer;
  border?: Border;
  filter?: Filter;
  overlay?: Overlay;
  transform?: Transform;
  crop?: Crop;
  shadow?: Shadow;
}

interface ImageState {
  imageData: string;
  filters: FilterState;
}

interface HistoryState {
  past: ImageState[];
  present: ImageState;
  future: ImageState[];
}

interface ImageEditorContextProps {
  imageState: ImageState;
  setImageState: (newState: ImageState) => void;
  setImageBackground: (imageUrl: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ImageEditorContext = createContext<ImageEditorContextProps | undefined>(undefined);

export const ImageEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: { imageData: '', filters: {} },
    future: [],
  });

  const setImageState = (newState: ImageState) => {
    setHistory((prevHistory) => ({
      past: [...prevHistory.past, prevHistory.present],
      present: newState,
      future: [], 
    }));
  };

  const setImageBackground = (imageUrl: string) => {
    setImageState({
      ...history.present,
      imageData: imageUrl,
    });
  };

  const undo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.past.length === 0) return prevHistory;

      const previous = prevHistory.past[prevHistory.past.length - 1];
      const newPast = prevHistory.past.slice(0, -1);
      const newFuture = [prevHistory.present, ...prevHistory.future];

      return {
        past: newPast,
        present: previous,
        future: newFuture,
      };
    });
  };

  const redo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.future.length === 0) return prevHistory;

      const next = prevHistory.future[0];
      const newFuture = prevHistory.future.slice(1);
      const newPast = [...prevHistory.past, prevHistory.present];

      return {
        past: newPast,
        present: next,
        future: newFuture,
      };
    });
  };

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return (
    <ImageEditorContext.Provider
      value={{
        imageState: history.present,
        setImageState,
        setImageBackground,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </ImageEditorContext.Provider>
  );
};

export const useImageEditorContext = () => {
  const context = useContext(ImageEditorContext);
  if (!context) {
    throw new Error('useImageEditorContext must be used within a ImageEditorProvider');
  }
  return context;
};