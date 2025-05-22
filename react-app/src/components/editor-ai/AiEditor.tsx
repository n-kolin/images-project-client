// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, StoreType } from '../../store/store';
// import { sendAiRequest } from '../../store/editorAiSlice';

// interface AiEditorProps {
//   imageUrl: string; // כתובת התמונה מ-AWS
// }

// const AiEditor: React.FC<AiEditorProps> = ({ imageUrl }) => {
//   const [input, setInput] = useState('');
//   const dispatch = useDispatch<AppDispatch>();
//   const aiResponse = useSelector((state: StoreType) => state.editorAi.response);
//   const isLoading = useSelector((state: StoreType) => state.editorAi.isLoading);

//   const handleSend = () => {
//     if (input.trim() === '') return;

//     // שליחת הטקסט והכתובת לשרת
//     dispatch(sendAiRequest({ instructions: input, imageUrl }));
//     setInput(''); // איפוס שדה הטקסט
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
//       <h2>AI Image Editor</h2>
//       <div style={{ marginBottom: '20px' }}>
//         <img
//           src={imageUrl}
//           alt="Preview"
//           style={{
//             maxWidth: '500px',
//             maxHeight: '300px',
//             border: '1px solid #ccc',
//             borderRadius: '8px',
//           }}
//         />
//       </div>
//       <div style={{ width: '100%', maxWidth: '600px' }}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//           placeholder="Describe your edit (e.g., 'Add a sunset background')"
//           style={{
//             width: '100%',
//             padding: '10px',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             marginBottom: '10px',
//           }}
//         />
//         <button
//           onClick={handleSend}
//           disabled={isLoading}
//           style={{
//             width: '100%',
//             padding: '10px',
//             backgroundColor: isLoading ? '#ccc' : '#007bff',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: isLoading ? 'not-allowed' : 'pointer',
//           }}
//         >
//           {isLoading ? 'Processing...' : 'Send'}
//         </button>
//       </div>
//       {aiResponse && (
//         <div style={{ marginTop: '20px', textAlign: 'center' }}>
//           <h3>AI Response:</h3>
//           <p>{aiResponse}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AiEditor;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../../store/store';
import { 
  sendAiRequest, 
  sendTextOnlyRequest, 
  checkServerHealth, 
  clearResults 
} from '../../store/editorAiSlice';

interface AiEditorProps {
  imageUrl: string; // כתובת התמונה
}

const AiEditor: React.FC<AiEditorProps> = ({ imageUrl }) => {
  const [input, setInput] = useState('');
  const [textOnlyInput, setTextOnlyInput] = useState('');
  const [showTextOnly, setShowTextOnly] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  const dispatch = useDispatch<AppDispatch>();
  
  // שימוש בסלקטורים המעודכנים מהסטור
  const {
    // originalInstructions,
    refinedInstructions,
    imageAnalysis,
    modifiedImage,
    isLoading,
    error
  } = useSelector((state: StoreType) => state.editorAi);

  // בדיקת בריאות השרת בטעינת הקומפוננטה
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await dispatch(checkServerHealth()).unwrap();
        setServerStatus('online');
      } catch (error) {
        setServerStatus('offline');
      }
    };
    
    checkHealth();
  }, [dispatch]);

  // שליחת בקשה לעריכת תמונה
  const handleSend = () => {
    if (input.trim() === '') return;

    // שליחת ההוראות והכתובת לשרת
    dispatch(sendAiRequest({ instructions: input, imageUrl }));
  };

  // שליחת בקשת טקסט בלבד
  const handleSendTextOnly = () => {
    if (textOnlyInput.trim() === '') return;
    
    dispatch(sendTextOnlyRequest(textOnlyInput));
  };

  // ניקוי התוצאות
  const handleClear = () => {
    dispatch(clearResults());
    setInput('');
    setTextOnlyInput('');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      gap: '20px'
    }}>
      <h2 style={{ marginBottom: '10px' }}>AI Image Editor</h2>
      
      {/* סטטוס השרת */}
      <div style={{
        padding: '8px 16px',
        borderRadius: '4px',
        backgroundColor: serverStatus === 'online' ? '#d4edda' : 
                         serverStatus === 'offline' ? '#f8d7da' : '#e2e3e5',
        color: serverStatus === 'online' ? '#155724' : 
               serverStatus === 'offline' ? '#721c24' : '#383d41',
        marginBottom: '15px',
        width: '100%',
        textAlign: 'center'
      }}>
        Server Status: {
          serverStatus === 'checking' ? 'Checking...' : 
          serverStatus === 'online' ? 'Online' : 'Offline'
        }
      </div>
      
      {/* כפתורי החלפה בין מצבים */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '15px',
        width: '100%'
      }}>
        <button 
          onClick={() => setShowTextOnly(false)}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: !showTextOnly ? '#007bff' : '#f8f9fa',
            color: !showTextOnly ? '#fff' : '#212529',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Image Editor
        </button>
        <button 
          onClick={() => setShowTextOnly(true)}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: showTextOnly ? '#007bff' : '#f8f9fa',
            color: showTextOnly ? '#fff' : '#212529',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Text Only
        </button>
      </div>
      
      {!showTextOnly ? (
        // מצב עריכת תמונה
        <>
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            width: '100%',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row'
          }}>
            {/* תמונה מקורית */}
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <h3>Original Image</h3>
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Original"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              />
            </div>
            
            {/* תמונה מעודכנת */}
            {modifiedImage && (
              <div style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <h3>Modified Image</h3>
                <img
                  src={`data:image/jpeg;base64,${modifiedImage}`}
                  alt="Modified"
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                  }}
                />
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `data:image/jpeg;base64,${modifiedImage}`;
                    link.download = 'modified-image.jpg';
                    link.click();
                  }}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Download
                </button>
              </div>
            )}
          </div>
          
          {/* טופס הזנת הוראות */}
          <div style={{ width: '100%', marginTop: '20px' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your edit (e.g., 'Change the red car to green')"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginBottom: '10px',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSend}
                disabled={isLoading || serverStatus !== 'online'}
                style={{
                  flex: 3,
                  padding: '10px',
                  backgroundColor: isLoading || serverStatus !== 'online' ? '#ccc' : '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isLoading || serverStatus !== 'online' ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? 'Processing...' : 'Edit Image'}
              </button>
              <button
                onClick={handleClear}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            </div>
          </div>
          
          {/* הצגת שגיאות */}
          {error && (
            <div style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
              marginTop: '15px'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {/* הצגת תוצאות הניתוח */}
          {refinedInstructions && (
            <div style={{ 
              width: '100%', 
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h3>Refined Instructions:</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{refinedInstructions}</p>
              
              {imageAnalysis && (
                <>
                  <h3>Image Analysis:</h3>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{imageAnalysis}</p>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        // מצב טקסט בלבד
        <div style={{ width: '100%' }}>
          <h3>Text-Only Mode</h3>
          <p>Use this mode to test the OpenAI API without image processing.</p>
          
          <textarea
            value={textOnlyInput}
            onChange={(e) => setTextOnlyInput(e.target.value)}
            placeholder="Enter your prompt here..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '10px',
              minHeight: '100px',
              resize: 'vertical'
            }}
          />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSendTextOnly}
              disabled={isLoading || serverStatus !== 'online'}
              style={{
                flex: 3,
                padding: '10px',
                backgroundColor: isLoading || serverStatus !== 'online' ? '#ccc' : '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading || serverStatus !== 'online' ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Processing...' : 'Send Text'}
            </button>
            <button
              onClick={handleClear}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
          
          {/* הצגת שגיאות */}
          {error && (
            <div style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
              marginTop: '15px'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {/* הצגת תשובת הטקסט */}
          {refinedInstructions && (
            <div style={{ 
              width: '100%', 
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h3>AI Response:</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{refinedInstructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiEditor;