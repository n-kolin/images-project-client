// // store/aiDesignSlice.ts

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // הגדרת הטיפוסים
// interface AIDesignRequest {
//   prompt: string;
//   currentState: any;
//   imageParams: {
//     width: number;
//     height: number;
//     format: string;
//   };
// }

// interface AIDesignResponse {
//   status: string;
//   data: {
//     filters: any;
//   };
//   response_time_seconds: number;
// }

// interface AIDesignState {
//   loading: boolean;
//   error: string | null;
//   lastResponse: any | null;
// }

// const initialState: AIDesignState = {
//   loading: false,
//   error: null,
//   lastResponse: null
// };

// // הגדרת ה-API URL
// const API_URL = 'https://image-editor-api-rcl9.onrender.com/image-design';

// // יצירת ה-Async Thunk
// export const generateDesign = createAsyncThunk<AIDesignResponse, AIDesignRequest>(
//   'aiDesign/generate',
//   async (request: AIDesignRequest, thunkAPI) => {
//     console.log('Request:', request);
    
//     try {
//       const response = await axios.post(API_URL, request);
//       console.log('Response:', response);
      
//       return response.data;
//     } catch (e: any) {
//       // שליחת השגיאה ל-Redux
//       console.log('Error:', e);
      
//       if (e.response && e.response.data && typeof e.response.data.error === 'string') {
//         return thunkAPI.rejectWithValue(e.response.data.error);
//       }
//       return thunkAPI.rejectWithValue(e.message || 'שגיאה לא ידועה');
//     }
//   }
// );

// // יצירת ה-Slice
// const aiDesignSlice = createSlice({
//   name: 'aiDesign',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearLastResponse: (state) => {
//       state.lastResponse = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // generateDesign
//       .addCase(generateDesign.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(generateDesign.fulfilled, (state, action) => {
//         state.loading = false;
//         state.lastResponse = action.payload.data;
//       })
//       .addCase(generateDesign.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string || 'Unknown error';
//       });
//   },
// });

// export const { clearError, clearLastResponse } = aiDesignSlice.actions;
// export default aiDesignSlice;

// store/aiDesignSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// הגדרת הטיפוסים
interface ImageFilters {
  transform?: {
    rotation?: number;
    scale?: number;
    flipX?: boolean;
    flipY?: boolean;
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  filter?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
    grayscale?: number;
  };
  overlay?: {
    color: string;
    blendMode: string;
  };
  border?: {
    width: number;
    color: string;
    style: string;
  };
  shadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  };
  textLayer?: {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily?: string;
    fontWeight?: string;
    textAlign?: string;
  };
  [key: string]: any; // לאפשר מפתחות דינמיים
}

interface ImageState {
  imageData: string | null;
  filters: ImageFilters;
}

interface AIDesignRequest {
  prompt: string;
  currentState: {
    filters: ImageFilters;
  };
  imageParams: {
    width: number;
    height: number;
    format: string;
  };
}

interface AIDesignResponse {
  status: string;
  data: {
    filters: ImageFilters;
  };
  response_time_seconds: number;
}

// המצב החדש שכולל גם את מצב התמונה
interface AIDesignState {
  loading: boolean;
  error: string | null;
  lastResponse: any | null;
  imageState: ImageState; // מצב התמונה נוסף כאן
}

// מצב התחלתי
const initialState: AIDesignState = {
  loading: false,
  error: null,
  lastResponse: null,
  imageState: {
    imageData: null,
    filters: {}
  }
};

// הגדרת ה-API URL
const API_URL = 'https://image-editor-api-rcl9.onrender.com/image-design';

// יצירת ה-Async Thunk
export const generateDesign = createAsyncThunk<AIDesignResponse, AIDesignRequest>(
  'aiDesign/generate',
  async (request: AIDesignRequest, thunkAPI) => {
    console.log('Request:', request);
    
    try {
      const response = await axios.post(API_URL, request);
      console.log('Response:', response);
      
      return response.data;
    } catch (e: any) {
      // שליחת השגיאה ל-Redux
      console.log('Error:', e);
      
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
    },
    // פעולות חדשות לעדכון מצב התמונה
    setImageData: (state, action: PayloadAction<string | null>) => {
      state.imageState.imageData = action.payload;
    },
    updateFilters: (state, action: PayloadAction<ImageFilters>) => {
      state.imageState.filters = {
        ...state.imageState.filters,
        ...action.payload
      };
    },
    updateFilter: (state, action: PayloadAction<{key: string, value: any}>) => {
      const { key, value } = action.payload;
      state.imageState.filters[key] = value;
    },
    resetFilters: (state) => {
      state.imageState.filters = {};
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
        
        // עדכון אוטומטי של מצב התמונה כאן!
        if (action.payload.data && action.payload.data.filters) {
          const newFilters = { ...state.imageState.filters };
          
          // עיבוד כל מפתח בתשובת ה-AI
          Object.keys(action.payload.data.filters).forEach(key => {
            if (!newFilters[key]) {
              newFilters[key] = action.payload.data.filters[key];
            } else {
              newFilters[key] = {
                ...newFilters[key],
                ...action.payload.data.filters[key]
              };
            }
          });
          
          // עדכון מצב התמונה ישירות ב-Redux
          state.imageState.filters = newFilters;
        }
      })
      .addCase(generateDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Unknown error';
      });
  },
});

export const { 
  clearError, 
  clearLastResponse,
  setImageData,
  updateFilters,
  updateFilter,
  resetFilters
} = aiDesignSlice.actions;

export default aiDesignSlice;