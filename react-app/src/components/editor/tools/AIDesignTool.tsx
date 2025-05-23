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


import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useImageEditorContext } from '../../../context/ImageEditorContext';
import { AppDispatch, StoreType } from '../../../store/store';
import { clearError, generateDesign } from '../../../store/aiDesignSlice';

// טיפוס להודעת צ'אט
interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  filters?: any; // האפקטים שהוחזרו מה-AI
}

const AIDesignTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { imageState, setImageState } = useImageEditorContext();
  
  // Get state from Redux
  const { loading, error, lastResponse } = useSelector((state: StoreType) => state.aiDesign);

  // כאשר מתקבלת תשובה חדשה מה-API, הוסף אותה להיסטוריית הצ'אט
  React.useEffect(() => {
    if (lastResponse && !loading) {
      // הוסף את תשובת ה-AI להיסטוריית הצ'אט
      setChatHistory(prev => [
        ...prev,
        {
          id: Date.now(),
          text: lastResponse.message || 'שינויים הוחלו בהצלחה',
          sender: 'ai',
          timestamp: new Date(),
          filters: lastResponse.filters
        }
      ]);
    }
  }, [lastResponse, loading]);

  // פונקציה להחלת האפקטים מהודעת צ'אט ספציפית
  const applyFiltersFromMessage = (message: ChatMessage) => {
    if (!message.filters) return;
    
    // עדכון ה-state בצורה בטוחה
    setImageState(prevState => {
      const newFilters = { ...prevState.filters };
      
      // עיבוד כל מפתח בתשובת ה-AI
      Object.keys(message.filters).forEach(key => {
        if (!newFilters[key]) {
          newFilters[key] = message.filters[key];
        } else {
          newFilters[key] = {
            ...newFilters[key],
            ...message.filters[key]
          };
        }
      });
      
      return {
        ...prevState,
        filters: newFilters
      };
    });
    
    console.log('Applied filters from message:', message.text);
  };

  // טיפול בשליחת הודעה חדשה
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // הוסף את הודעת המשתמש להיסטוריית הצ'אט
    const newUserMessage: ChatMessage = {
      id: Date.now(),
      text: prompt,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);
    
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
    
    // Send the request
    dispatch(generateDesign(request));
    
    // נקה את שדה הקלט
    setPrompt('');
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>AI Design Chat</h3>
      
      {/* היסטוריית הצ'אט */}
      <div 
        style={{ 
          height: '300px', 
          overflowY: 'auto', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: '#f9f9f9'
        }}
      >
        {chatHistory.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '120px' }}>
            התחל שיחה עם ה-AI כדי לעצב את התמונה שלך
          </div>
        ) : (
          chatHistory.map(message => (
            <div 
              key={message.id}
              style={{
                marginBottom: '10px',
                textAlign: message.sender === 'user' ? 'right' : 'left'
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  maxWidth: '80%',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  backgroundColor: message.sender === 'user' ? '#e1f5fe' : '#f0f4c3',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ marginBottom: '4px' }}>{message.text}</div>
                <div style={{ fontSize: '10px', color: '#888' }}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
                
                {/* כפתור להחלת האפקטים אם זו הודעת AI עם אפקטים */}
                {message.sender === 'ai' && message.filters && (
                  <button
                    onClick={() => applyFiltersFromMessage(message)}
                    style={{
                      marginTop: '5px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    החל אפקטים
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* טופס שליחת הודעה */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        {error && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex' }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="תאר את השינויים שאתה רוצה (לדוגמה: 'הוסף מסגרת ורודה דקה')"
            style={{ 
              flex: 1, 
              minHeight: '60px', 
              padding: '8px',
              borderRadius: '4px 0 0 4px',
              border: '1px solid #ddd',
              borderRight: 'none'
            }}
          />
          <button 
            type="submit" 
            disabled={loading || !prompt.trim()}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'מעבד...' : 'שלח'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIDesignTool;