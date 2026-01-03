// src/features/concours/concoursSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchConcours } from "./concoursService";

export const getConcours = createAsyncThunk(
  "concours/getAll",
  async (_, thunkAPI) => {
    try {
      return await fetchConcours();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur de chargement"
      );
    }
  }
);

interface ConcoursState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ConcoursState = {
  data: [],
  loading: false,
  error: null,
};

const concoursSlice = createSlice({
  name: "concours",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getConcours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConcours.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getConcours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default concoursSlice.reducer;
