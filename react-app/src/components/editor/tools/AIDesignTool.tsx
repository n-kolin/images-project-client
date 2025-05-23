// // components/ImageEditor/tools/AIDesign.tsx

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useImageEditorContext } from '../../../context/ImageEditorContext';
// import { AppDispatch, StoreType } from '../../../store/store';
// import { clearError, generateDesign } from '../../../store/aiDesignSlice';

// const AIDesignTool: React.FC = () => {
//   const [prompt, setPrompt] = useState('');
//   const dispatch = useDispatch<AppDispatch>();
//   const { imageState, setImageState } = useImageEditorContext();
  
//   // Get state from Redux
//   const { loading, error, lastResponse } = useSelector((state: StoreType) => state.aiDesign);

//   // Handle API response
//   useEffect(() => {
//     if (lastResponse && lastResponse.filters) {
//       // Smart merging of new changes with existing state
//       const newFilters = { ...imageState.filters };
      
//       // Process each key in the AI response
//       Object.keys(lastResponse.filters).forEach(key => {
//         // If the key doesn't exist in current filters, add it
//         if (!newFilters[key]) {
//           newFilters[key] = lastResponse.filters[key];
//         } 
//         // If the key exists, merge only the changed properties
//         else {
//           // For all object types, merge only the changed properties
//           newFilters[key] = {
//             ...newFilters[key],
//             ...lastResponse.filters[key]
//           };
//         }
//       });
      
//       // Update the state
//       setImageState({
//         ...imageState,
//         filters: newFilters
//       });
//     }
//   }, [lastResponse, imageState, setImageState]);

//   // Handle form submission
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!prompt.trim()) return;
    
//     // Clear previous errors
//     dispatch(clearError());
    
//     // Prepare the request
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
    
//     // Send the request
//     dispatch(generateDesign(request));
//   };

//   return (
//     <div style={{ marginBottom: '20px' }}>
//       <h3>AI Design Tool</h3>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '10px' }}>
//           <textarea
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             placeholder="Describe the changes you want (e.g., 'Add a thin pink border')"
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
//           {loading ? 'Processing...' : 'Apply Design'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AIDesignTool;

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useImageEditorContext } from '../../../context/ImageEditorContext';
import { AppDispatch, StoreType } from '../../../store/store';
import { clearError, generateDesign } from '../../../store/aiDesignSlice';

const AIDesignTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { imageState, setImageState } = useImageEditorContext();
  
  // שמירת התשובה האחרונה שטופלה כדי למנוע עיבוד כפול
  const lastProcessedResponseRef = useRef<any>(null);
  
  // Get state from Redux
  const { loading, error, lastResponse } = useSelector((state: StoreType) => state.aiDesign);

  // Handle API response - עדכון אוטומטי מיד כשמגיעה תשובה
  useEffect(() => {
    // בדוק אם יש תשובה חדשה שלא טופלה עדיין
    if (
      lastResponse && 
      lastResponse.filters && 
      lastResponse !== lastProcessedResponseRef.current
    ) {
      console.log('New AI response received:', lastResponse);
      
      // סמן את התשובה כמטופלת
      lastProcessedResponseRef.current = lastResponse;
      
      // עדכן את ה-state מיד - בצורה בטוחה שמונעת לולאה
      setImageState(prevState => {
        console.log('Updating state with new filters');
        const newFilters = { ...prevState.filters };
        
        // עיבוד כל מפתח בתשובת ה-AI
        Object.keys(lastResponse.filters).forEach(key => {
          if (!newFilters[key]) {
            // אם המפתח לא קיים, הוסף אותו
            newFilters[key] = lastResponse.filters[key];
            console.log(`Added new filter: ${key}`, lastResponse.filters[key]);
          } else {
            // אם המפתח קיים, מזג את הערכים
            newFilters[key] = {
              ...newFilters[key],
              ...lastResponse.filters[key]
            };
            console.log(`Updated existing filter: ${key}`, newFilters[key]);
          }
        });
        
        return {
          ...prevState,
          filters: newFilters
        };
      });
      
      console.log('State updated successfully');
    }
  }, [lastResponse, setImageState]); // רק lastResponse ו-setImageState כתלויות

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    console.log('Submitting prompt:', prompt);
    
    // Clear previous errors
    dispatch(clearError());
    
    // Prepare the request
    const request = {
      prompt,
      currentState: {
        filters: imageState.filters
      },
      imageParams: {
        width: 500,
        height: 500,
        format: 'jpg'
      }
    };
    
    console.log('Sending request to AI:', request);
    
    // Send the request
    dispatch(generateDesign(request));
    
    // נקה את שדה הקלט אחרי השליחה
    setPrompt('');
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>AI Design Tool</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="תאר את השינויים שאתה רוצה (לדוגמה: 'הוסף מסגרת ורודה דקה')"
            style={{ 
              width: '100%', 
              minHeight: '80px', 
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
        </div>
        
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '10px',
            padding: '8px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </div>
        )}
        
        {loading && (
          <div style={{ 
            color: '#1976d2', 
            marginBottom: '10px',
            padding: '8px',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            border: '1px solid #bbdefb'
          }}>
            מעבד את הבקשה... אנא המתן
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading || !prompt.trim()}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          {loading ? 'מעבד...' : 'החל עיצוב'}
        </button>
      </form>
      
     
    </div>
  );
};

export default AIDesignTool;