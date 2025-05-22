// store/aiDesignSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// הגדרת הטיפוסים
interface AIDesignRequest {
  prompt: string;
  currentState: any;
  imageParams: {
    width: number;
    height: number;
    format: string;
  };
}

interface AIDesignResponse {
  status: string;
  data: {
    filters: any;
  };
  response_time_seconds: number;
}

interface AIDesignState {
  loading: boolean;
  error: string | null;
  lastResponse: any | null;
}

const initialState: AIDesignState = {
  loading: false,
  error: null,
  lastResponse: null
};

// הגדרת ה-API URL
const API_URL = 'https://image-editor-api-rcl9.onrender.com/image-design';

// יצירת ה-Async Thunk
export const generateDesign = createAsyncThunk<AIDesignResponse, AIDesignRequest>(
  'aiDesign/generate',
  async (request: AIDesignRequest, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, request);
      return response.data;
    } catch (e: any) {
      // שליחת השגיאה ל-Redux
      if (e.response && e.response.data && typeof e.response.data.error === 'string') {
        return thunkAPI.rejectWithValue(e.response.data.error);
      }
      return thunkAPI.rejectWithValue(e.message || 'שגיאה לא ידועה');
    }
  }
);

// יצירת ה-Slice
const aiDesignSlice = createSlice({
  name: 'aiDesign',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastResponse: (state) => {
      state.lastResponse = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // generateDesign
      .addCase(generateDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.lastResponse = action.payload.data;
      })
      .addCase(generateDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Unknown error';
      });
  },
});

export const { clearError, clearLastResponse } = aiDesignSlice.actions;
export default aiDesignSlice;