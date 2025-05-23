// components/ImageEditor/tools/AIDesign.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useImageEditorContext } from '../../../context/ImageEditorContext';
import { AppDispatch, StoreType } from '../../../store/store';
import { clearError, generateDesign } from '../../../store/aiDesignSlice';

const AIDesignTool: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { imageState, setImageState } = useImageEditorContext();

    // Get state from Redux
    const { loading, error, lastResponse } = useSelector((state: StoreType) => state.aiDesign);

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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

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
        dispatch(generateDesign(request)).then((result) => {
            // בדוק אם הבקשה הצליחה
            if (generateDesign.fulfilled.match(result)) {
                const response = result.payload;

                console.log('AI response received:', response);

                // בדוק אם יש פילטרים בתשובה
                if (response && response.filters) {
                    // Smart merging of new changes with existing state
                    const newFilters = { ...imageState.filters };

                    // Process each key in the AI response
                    Object.keys(response.filters).forEach(key => {
                        // If the key doesn't exist in current filters, add it
                        if (!newFilters[key]) {
                            newFilters[key] = response.filters[key];
                            console.log(`Added new filter: ${key}`, response.filters[key]);
                        }
                        // If the key exists, merge only the changed properties
                        else {
                            // For all object types, merge only the changed properties
                            newFilters[key] = {
                                ...newFilters[key],
                                ...response.filters[key]
                            };
                            console.log(`Updated existing filter: ${key}`, newFilters[key]);
                        }
                    });

                    // Update the state
                    setImageState({
                        ...imageState,
                        filters: newFilters
                    });

                    console.log('Image state updated successfully');

                    // נקה את שדה הקלט אחרי עדכון מוצלח
                    setPrompt('');
                }
            } else {
                // אם הבקשה נכשלה
                console.error('AI request failed:', result.error);
            }
        })
            .catch((error) => {
                // טיפול בשגיאות
                console.error('Error in AI request:', error);
            });
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <h3>AI Design Tool</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the changes you want (e.g., 'Add a thin pink border')"
                        style={{ width: '100%', minHeight: '80px', padding: '8px' }}
                    />
                </div>
                {error && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {error}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: loading ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Processing...' : 'Apply Design'}
                </button>
            </form>
        </div>
    );
};

export default AIDesignTool;
