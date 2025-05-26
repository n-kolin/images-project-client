// components/ImageEditor/tools/AIDesign.tsx

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useImageEditorContext } from '../../../context/ImageEditorContext';
// import { AppDispatch, StoreType } from '../../../store/store';
// import { clearError, generateDesign } from '../../../store/aiDesignSlice';

// const AIDesignTool: React.FC = () => {
//     const [prompt, setPrompt] = useState('');
//     const dispatch = useDispatch<AppDispatch>();
//     const { imageState, setImageState } = useImageEditorContext();

//     // Get state from Redux
//     const { loading, error, lastResponse } = useSelector((state: StoreType) => state.aiDesign);

// Handle API response
// useEffect(() => {
//     if (lastResponse && lastResponse.filters) {
//         // Smart merging of new changes with existing state
//         const newFilters = { ...imageState.filters };

//         // Process each key in the AI response
//         Object.keys(lastResponse.filters).forEach(key => {
//             // If the key doesn't exist in current filters, add it
//             if (!newFilters[key]) {
//                 newFilters[key] = lastResponse.filters[key];
//             }
//             // If the key exists, merge only the changed properties
//             else {
//                 // For all object types, merge only the changed properties
//                 newFilters[key] = {
//                     ...newFilters[key],
//                     ...lastResponse.filters[key]
//                 };
//             }
//         });

//         // Update the state
//         setImageState({
//             ...imageState,
//             filters: newFilters
//         });
//     }
// }, [lastResponse, imageState, setImageState]);

// Handle form submission
// components/ImageEditor/tools/AIDesign.tsx

// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, StoreType } from '../../../store/store';
// import { clearError, generateDesign } from '../../../store/aiDesignSlice';

// const AIDesignTool: React.FC = () => {
//   const [prompt, setPrompt] = useState('');
//   const dispatch = useDispatch<AppDispatch>();

//   // קבלת מצב התמונה ישירות מ-Redux
//   const { loading, error, imageState } = useSelector((state: StoreType) => state.aiDesign);
// // const  loading = useSelector((state: StoreType) => state.aiDesign.present.loading)
// // const  error = useSelector((state: StoreType) => state.aiDesign.present.error)
// // const  imageState = useSelector((state: StoreType) => state.aiDesign.present.imageState)

//   // טיפול בשליחת הטופס
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!prompt.trim()) return;

//     // ניקוי שגיאות קודמות
//     dispatch(clearError());

//     // הכנת הבקשה
//     const request = {
//       prompt,
//       currentState: {
//         filters: imageState.filters
//       },
//       imageParams: {
//         width: 500,
//         height: 500,
//         format: 'jpg'
//       }
//     };

//     // שליחת הבקשה - אין צורך ב-.then() כי העדכון קורה אוטומטית ב-slice
//     dispatch(generateDesign(request))
//       .then(() => {
//         // ניקוי שדה הקלט אחרי שליחה מוצלחת
//         setPrompt('');
//       })
//       .catch((error) => {
//         console.error('Error in AI request:', error);
//       });
//   };

//   return (
//     <div style={{ marginBottom: '20px' }}>
//       <h3>AI Design Tool</h3>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '10px' }}>
//           <textarea
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             placeholder="תאר את השינויים שאתה רוצה (לדוגמה: 'הוסף מסגרת ורודה דקה')"
//             style={{ width: '100%', minHeight: '80px', padding: '8px' }}
//           />
//         </div>
//         {error && (
//           <div style={{ color: 'red', marginBottom: '10px' }}>
//             {error}
//           </div>
//         )}
//         <button 
//           type="submit" 
//           disabled={loading || !prompt.trim()}
//           style={{ 
//             padding: '8px 16px', 
//             backgroundColor: loading ? '#ccc' : '#4CAF50',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: loading ? 'not-allowed' : 'pointer'
//           }}
//         >
//           {loading ? 'מעבד...' : 'החל עיצוב'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AIDesignTool
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../../../store/store"
import { clearError, generateDesign } from "../../../store/aiDesignSlice"
import "../../../css/AIDesignTool.css"

const AIDesignTool: React.FC = () => {
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dispatch = useDispatch<AppDispatch>()

  // קבלת מצב התמונה ישירות מ-Redux
  const { loading, error, imageState } = useSelector((state: StoreType) => state.aiDesign)

  // פונקציה לעדכון גובה הטקסט אוטומטית
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.max(44, textarea.scrollHeight)}px`
    }
  }

  // עדכון גובה כשהטקסט משתנה
  useEffect(() => {
    adjustTextareaHeight()
  }, [prompt])

  // טיפול בלחיצת מקשים
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  // טיפול בשינוי טקסט
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  // טיפול בשליחת הטופס
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    // שמירת הטקסט שנשלח והצגת ההודעה
    setSubmittedPrompt(prompt)
    setShowMessage(true)

    // ניקוי שגיאות קודמות
    dispatch(clearError())

    // הכנת הבקשה
    const request = {
      prompt,
      currentState: {
        filters: imageState.filters,
      },
      imageParams: {
        width: 500,
        height: 500,
        format: "jpg",
      },
    }

    // שליחת הבקשה
    dispatch(generateDesign(request))
      .then(() => {
        // ניקוי שדה הקלט אחרי שליחה מוצלחת
        setPrompt("")
        // איפוס גובה הטקסט
        if (textareaRef.current) {
          textareaRef.current.style.height = "44px"
        }
        // הסתרת ההודעה אחרי האנימציה
        setTimeout(() => {
          setShowMessage(false)
        }, 3500)
      })
      .catch((error) => {
        console.error("Error in AI request:", error)
        setTimeout(() => {
          setShowMessage(false)
        }, 3500)
      })
  }

  return (<>
    <div className="image-editor-header">
      <h1 >Image Editor</h1>
    </div>
    <div className="ai-design-tool">

      <h3 className="ai-tool-title">AI Design Tool</h3>

      {/* Chat Message */}
      {showMessage && <div className={`chat-message ${showMessage ? "show" : ""}`}>{submittedPrompt}</div>}

      <form onSubmit={handleSubmit} className="ai-form">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe the changes you want (e.g., 'add a thin pink border')"
            className="ai-textarea"
            rows={3}
          />
        </div>

        {/* {error && <div className="error-message">{error}</div>} */}

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className={`ai-submit-button ${loading ? "loading" : ""}`}
        >
          {loading ? "Processing..." : "Apply Design"}
        </button>
      </form>
    </div>
  </>)
}

export default AIDesignTool

