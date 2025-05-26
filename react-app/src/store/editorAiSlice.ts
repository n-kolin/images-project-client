import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface EditorAiState {
  originalInstructions: string | null;
  refinedInstructions: string | null;
  imageAnalysis: string | null;
  modifiedImage: string | null; // base64 encoded image
  isLoading: boolean;
  error: string | null;
}

const initialState: EditorAiState = {
  originalInstructions: null,
  refinedInstructions: null,
  imageAnalysis: null,
  modifiedImage: null,
  isLoading: false,
  error: null,
};

const baseUrl = 'https://images-editor-server.onrender.com/api';

// פעולה אסינכרונית לשליחת בקשה לשרת
export const sendAiRequest = createAsyncThunk(
  'editorAi/sendAiRequest',
  async ({ instructions, imageUrl }: { instructions: string; imageUrl: string }) => {
    // שימוש באנדפוינט process-image במקום api/ai/edit
    const response = await axios.post(baseUrl+'/process-image', {
      // שינוי שמות הפרמטרים להתאמה לשרת הפייתון
      instructions: instructions,
      image_url: imageUrl
    });
    
    // החזרת המידע המלא מהשרת
    return response.data;
  }
);

// פעולה אסינכרונית לשליחת בקשת טקסט בלבד
export const sendTextOnlyRequest = createAsyncThunk(
  'editorAi/sendTextOnlyRequest',
  async (prompt: string) => {
    const response = await axios.post(baseUrl+'/openai-text', { prompt });
    return response.data;
  }
);

// פעולה אסינכרונית לבדיקת בריאות השרת
export const checkServerHealth = createAsyncThunk(
  'editorAi/checkServerHealth',
  async () => {
    const response = await axios.get(baseUrl+'/health');
    return response.data;
  }
);

const editorAiSlice = createSlice({
  name: 'editorAi',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.originalInstructions = null;
      state.refinedInstructions = null;
      state.imageAnalysis = null;
      state.modifiedImage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // טיפול בבקשת עריכת תמונה
      .addCase(sendAiRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendAiRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        // עדכון השדות בהתאם למבנה התשובה מהשרת
        state.originalInstructions = action.payload.original_instructions;
        state.refinedInstructions = action.payload.refined_instructions;
        state.imageAnalysis = action.payload.image_analysis;
        state.modifiedImage = action.payload.modified_image;
      })
      .addCase(sendAiRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'אירעה שגיאה בעיבוד הבקשה';
      })
      
      // טיפול בבקשת טקסט בלבד
      .addCase(sendTextOnlyRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendTextOnlyRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        // עדכון רק שדה התשובה הרלוונטי
        state.refinedInstructions = action.payload.response;
      })
      .addCase(sendTextOnlyRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'אירעה שגיאה בעיבוד בקשת הטקסט';
      })
      
      // טיפול בבדיקת בריאות השרת
      .addCase(checkServerHealth.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearResults } = editorAiSlice.actions;
export default editorAiSlice;