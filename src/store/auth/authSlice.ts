/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "@/services/authService";
import type { AuthState, LoginPayload, RegisterPayload } from "@/types";
import { toast } from "sonner";

const extractError = (error: any): string => {
  const data = error.response?.data;

  if (!data) return "Une erreur est survenue";

  // Erreurs par champ
  if (data.errors) {
    return Object.values(data.errors).flat().join("\n");
  }

  // Message global
  if (data.message) {
    return data.message;
  }

  return "Une erreur est survenue";
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await authService.login(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Erreur de connexion"
      );
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await authService.register(payload);

      toast.success(res.data.message || "Inscription réussie", {
        duration: 5000,
      });

      return res;
    } catch (err: any) {
      const errorMessage = extractError(err);

      toast.error("Erreur lors de l'inscription", {
        description: errorMessage,
        duration: 6000,
      });

      return rejectWithValue(errorMessage);
    }
  }
);

export const getMeThunk = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getMe();
    } catch (err: any) {
      return rejectWithValue("Session expirée");
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  success: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Redux-persist va automatiquement persister ces changements
    },
    clearAuthState(state) {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.success = action.payload.data.success;
        // Redux-persist va automatiquement persister ces changements
      })
      .addCase(loginThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // GET ME
      .addCase(getMeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getMeThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
