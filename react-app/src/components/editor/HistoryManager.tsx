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
import { ActionCreators } from "redux-undo"
import { StoreType } from "../../store/store"

const HistoryManager: React.FC = () => {
  const dispatch = useDispatch()

  // גישה להיסטוריה
  const canUndo = useSelector((state: StoreType) => state.aiDesign.past.length > 0)
  const canRedo = useSelector((state: StoreType) => state.aiDesign.future.length > 0)

  // גישה למצב הנוכחי לצורך הצגת מידע
  const currentState = useSelector((state: StoreType) => state.aiDesign.present)

  const handleUndo = () => {
    dispatch(ActionCreators.undo())
  }

  const handleRedo = () => {
    dispatch(ActionCreators.redo())
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">History Manager</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Redo
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <p>History: {useSelector((state: StoreType) => state.aiDesign.past.length)} past states</p>
        <p>Future: {useSelector((state: StoreType) => state.aiDesign.future.length)} future states</p>
        <p>Loading: {currentState.loading ? "Yes" : "No"}</p>
        <p>Has Error: {currentState.error ? "Yes" : "No"}</p>
      </div>
    </div>
  )
}

export default HistoryManager
