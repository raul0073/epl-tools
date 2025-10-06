import { MatchPrediction, PrivateLeague, RoundPredictions, SeasonPoints, SeasonPredictions, UserState } from "@/types/api/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
  id: null,
  email: null,
  name: null,
  picture: null,
  team_name: null,
  fantasy_team_id: null,
  predictions: {},
  season_predictions: { relegated_teams: [] },
  points: {
    rounds: {},
    total_points: 0,
    top_scorer: 0,
    league_champion: 0,
    assist_king: 0,
    relegated_teams: {}
  },
  private_leagues: []
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      state.id = action.payload.id ?? state.id;
      state.email = action.payload.email ?? state.email;
      state.name = action.payload.name ?? state.name;
      state.picture = action.payload.picture ?? state.picture;
      state.team_name = action.payload.team_name ?? state.team_name;
      state.predictions = action.payload.predictions ?? state.predictions;
      state.season_predictions = { ...state.season_predictions, ...action.payload.season_predictions };
      state.points = action.payload.points ?? state.points;
      state.private_leagues = action.payload.private_leagues ?? state.private_leagues;
      state.fantasy_team_id = action.payload.fantasy_team_id ?? state.fantasy_team_id;
    },

    clearUser: (state) => {
      state.id = null;
      state.email = null;
      state.name = null;
      state.picture = null;
      state.team_name = null;
      state.fantasy_team_id = null;
      state.predictions = {};
      state.season_predictions = { relegated_teams: [] };
      state.points = {
        rounds: {},
        total_points: 0,
        top_scorer: 0,
        league_champion: 0,
        assist_king: 0,
        relegated_teams: {}
      };
      state.private_leagues = [];
    },

    setSeasonPredictions: (state, action: PayloadAction<SeasonPredictions>) => {
      state.season_predictions = { ...state.season_predictions, ...action.payload };
    },

    setUserPredictions: (state, action: PayloadAction<Record<number, RoundPredictions>>) => {
      state.predictions = action.payload;
    },

    updatePrediction: (
      state,
      action: PayloadAction<{ round_number: number; prediction: MatchPrediction }>
    ) => {
      const { round_number, prediction } = action.payload;
      if (!state.predictions[round_number]) {
        state.predictions[round_number] = { matches: [] };
      }
      const matches = state.predictions[round_number].matches;
      const existingIndex = matches.findIndex((m) => m.game_id === prediction.game_id);
      if (existingIndex !== -1) {
        matches[existingIndex] = prediction;
      } else {
        matches.push(prediction);
      }
    },

    setUserPoints: (state, action: PayloadAction<SeasonPoints>) => {
      state.points = action.payload;
    },

    setPrivateLeagues: (state, action: PayloadAction<PrivateLeague[]>) => {
      state.private_leagues = action.payload;
    }
  }
});

export const {
  setUser,
  clearUser,
  setSeasonPredictions,
  setUserPredictions,
  updatePrediction,
  setUserPoints,
  setPrivateLeagues
} = userSlice.actions;

export default userSlice.reducer;
