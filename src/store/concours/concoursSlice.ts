/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ConcoursState, FetchConcoursParams } from "@/types";
import { concoursService } from "@/services/concoursService";

export const getConcours = createAsyncThunk(
  "concours/getAll",
  async (params: FetchConcoursParams, thunkAPI) => {
    try {
      return await concoursService.getAll(params);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur de chargement"
      );
    }
  }
);

export const getConcoursById = createAsyncThunk(
  "concours/getById",
  async (id: number | string, thunkAPI) => {
    try {
      return await concoursService.getById(Number(id));
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Erreur lors du chargement du concours"
      );
    }
  }
);



const initialState: ConcoursState = {
  data: [],
  selected: null,
  loading: false,
  error: null,
  meta: null,
};

const concoursSlice = createSlice({
  name: "concours",
  initialState,
  reducers: {
    clearSelectedConcours: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConcours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConcours.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.meta = action.payload.meta;
      })
      .addCase(getConcours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getConcoursById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selected = null;
      })
      .addCase(getConcoursById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(getConcoursById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedConcours } = concoursSlice.actions;
export default concoursSlice.reducer;
