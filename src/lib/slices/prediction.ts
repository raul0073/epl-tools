import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// -----------------------------
// Types aligned with server
// -----------------------------
export interface MatchPrediction {
  game_id: string;
  home_team?: string | null;
  away_team?: string | null;
  home_score?: number | null;
  away_score?: number | null;
  created_at?: string | null; // ISO string
}

export interface RoundPredictions {
  matches: MatchPrediction[];
}

export type Predictions = Record<number, RoundPredictions>; // round_number -> RoundPredictions

// -----------------------------
// Slice state
// -----------------------------
interface PredictionsState {
  predictions: Predictions;
}

const initialState: PredictionsState = {
  predictions: {},
};

// -----------------------------
// Slice actions
// -----------------------------
interface UpdatePredictionPayload {
  round_number: number;
  prediction: MatchPrediction;
}

const predictionsSlice = createSlice({
  name: "predictions",
  initialState,
  reducers: {
    // Add or replace a prediction
    updatePrediction: (state, action: PayloadAction<UpdatePredictionPayload>) => {
      const { round_number, prediction } = action.payload;

      if (!state.predictions[round_number]) {
        state.predictions[round_number] = { matches: [] };
      }

      const matches = state.predictions[round_number].matches;
      const existingIndex = matches.findIndex((m) => m.game_id === prediction.game_id);

      if (existingIndex !== -1) {
        // Replace existing prediction
        matches[existingIndex] = prediction;
      } else {
        // Add new prediction
        matches.push(prediction);
      }
    },

    // Completely remove all predictions
    clearPredictions: (state) => {
      state.predictions = {};
    },
  },
});

export const { updatePrediction, clearPredictions } = predictionsSlice.actions;
export default predictionsSlice.reducer;
