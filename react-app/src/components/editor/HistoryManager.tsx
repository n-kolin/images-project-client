// import React from 'react';
// import { useImageEditorContext } from '../../context/ImageEditorContext';

// const HistoryManager: React.FC = () => {
//   const { undo, redo, canUndo, canRedo } = useImageEditorContext();

//   return (
//     <div>
//       <button onClick={undo} disabled={!canUndo}>
//         Undo
//       </button>
//       <button onClick={redo} disabled={!canRedo}>
//         Redo
//       </button>
//     </div>
//   );
// };

// export default HistoryManager;

"use client"

import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import { undo, redo, clearHistory } from "../store/ai-design-slice"
import { StoreType } from "../../store/store"

const HistoryManager: React.FC = () => {
  const dispatch = useDispatch()

  // בדיקה אם אפשר לבצע undo/redo
  const canUndo = useSelector((state: StoreType) => state.aiDesign.past.length > 0)
  const canRedo = useSelector((state: StoreType) => state.aiDesign.future.length > 0)

  // מידע נוסף על ההיסטוריה
  const pastStatesCount = useSelector((state: StoreType) => state.aiDesign.past.length)
  const futureStatesCount = useSelector((state: StoreType) => state.aiDesign.future.length)

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-3">היסטוריית עריכה</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => dispatch(undo())}
          disabled={!canUndo}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          בטל (Undo)
        </button>

        <button
          onClick={() => dispatch(redo())}
          disabled={!canRedo}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          בצע שוב (Redo)
        </button>

        <button
          onClick={() => dispatch(clearHistory())}
          disabled={!canUndo && !canRedo}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          נקה היסטוריה
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <p>מצבים קודמים: {pastStatesCount}</p>
        <p>מצבים עתידיים: {futureStatesCount}</p>
      </div>
    </div>
  )
}

export default HistoryManager

