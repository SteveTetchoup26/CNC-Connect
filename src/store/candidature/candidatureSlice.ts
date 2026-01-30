// src/store/candidature/candidatureSlice.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCandidatures,
  fetchCandidatureById,
  createRappel,
  downloadFiche,
  submitInscription,
} from "@/services/candidatureService";

interface Candidature {
  id: number;
  statut: string;
  date_candidature: string;
  concours: any;
  centre_examen: any;
  centre_depot: any;
  historiques?: any;
}

interface CandidatureState {
  data: Candidature[];
  selected: Candidature | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitSuccess: boolean;
}

const initialState: CandidatureState = {
  data: [],
  selected: null,
  loading: false,
  error: null,
  submitting: false,
  submitSuccess: false,
};

// Thunks
export const getCandidatures = createAsyncThunk(
  "candidatures/getAll",
  async (_, thunkAPI) => {
    try {
      return await fetchCandidatures();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur de chargement des candidatures"
      );
    }
  }
);

export const getCandidatureById = createAsyncThunk(
  "candidatures/getById",
  async (id: number | string, thunkAPI) => {
    try {
      return await fetchCandidatureById(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur lors du chargement de la candidature"
      );
    }
  }
);

export const definirRappel = createAsyncThunk(
  "candidatures/definirRappel",
  async (
    {
      candidatureId,
      data,
    }: {
      candidatureId: number;
      data: { date_rappel: string; heure_rappel: string };
    },
    thunkAPI
  ) => {
    try {
      return await createRappel(candidatureId, data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur lors de la définition du rappel"
      );
    }
  }
);

// candidatureSlice.ts
export const telechargerFiche = createAsyncThunk(
  "candidatures/telechargerFiche",
  async (candidatureId: number, thunkAPI) => {
    try {
      return await downloadFiche(candidatureId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur lors du téléchargement de la fiche"
      );
    }
  }
);

export const inscrireConcours = createAsyncThunk(
  "candidatures/inscrire",
  async (data: FormData, thunkAPI) => {
    try {
      return await submitInscription(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur lors de l'inscription"
      );
    }
  }
);

const candidatureSlice = createSlice({
  name: "candidatures",
  initialState,
  reducers: {
    clearSelectedCandidature: (state) => {
      state.selected = null;
    },
    resetSubmitState: (state) => {
      state.submitting = false;
      state.submitSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all candidatures
      .addCase(getCandidatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCandidatures.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCandidatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get candidature by ID
      .addCase(getCandidatureById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selected = null;
      })
      .addCase(getCandidatureById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(getCandidatureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Définir rappel
      .addCase(definirRappel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(definirRappel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(definirRappel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Télécharger fiche
      .addCase(telechargerFiche.pending, (state) => {
        state.error = null;
      })
      .addCase(telechargerFiche.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(telechargerFiche.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Inscription concours
      .addCase(inscrireConcours.pending, (state) => {
        state.submitting = true;
        state.submitSuccess = false;
        state.error = null;
      })
      .addCase(inscrireConcours.fulfilled, (state) => {
        state.submitting = false;
        state.submitSuccess = true;
      })
      .addCase(inscrireConcours.rejected, (state, action) => {
        state.submitting = false;
        state.submitSuccess = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedCandidature, resetSubmitState } = candidatureSlice.actions;
export default candidatureSlice.reducer;