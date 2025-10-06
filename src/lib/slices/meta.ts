import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// -----------------------------
// Slice state
// -----------------------------
interface MetaState {
  currentRound: number | null;
}

const initialState: MetaState = {
  currentRound: null,
};

const metaSlice = createSlice({
  name: "meta",
  initialState,
  reducers: {
    // Update current round
    updateRound: (state, action: PayloadAction<number>) => {
      state.currentRound = action.payload;
    },

    // Reset meta state
    clearMeta: (state) => {
      state.currentRound = null;
    },
  },
});

export const { updateRound, clearMeta } = metaSlice.actions;
export default metaSlice.reducer;
