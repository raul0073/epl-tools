
// -----------------------------
// Points interfaces (matches server Points / SeasonPoints)
// -----------------------------
export interface MatchPoints {
  game_id: string;
  points: number;
}

export interface RoundPoints {
  round_number: number;
  matches: MatchPoints[];
  total_points: number;
}

export interface SeasonPoints {
  rounds: Record<number, RoundPoints>; // round_number -> RoundPoints
  total_points: number;
  top_scorer: number;
  league_champion: number;
  assist_king: number;
  relegated_teams?: Record<string, number>; // team_name -> points
}

// -----------------------------
// Prediction interfaces
// -----------------------------
export interface MatchPrediction {
  game_id: string;
  home_team?: string;
  away_team?: string;
  home_score?: number;
  away_score?: number;
  created_at?: string;
  points?: number;
}

export interface RoundPredictions {
  matches: MatchPrediction[];
}

export interface SeasonPredictions {
  top_scorer?: string;
  league_champion?: string;
  assist_king?: string;
  relegated_teams?: string[];
  created_at?: string;
  points?: number;
}

// -----------------------------
// Private League interface
// -----------------------------
export interface PrivateLeagueManager {
  user_id: string;
  team_name: string;
  points: SeasonPoints;
}

export interface PrivateLeague {
  name: string;
  admin_id: string;
  rules: {
    points_for_bullseye: number;
    points_for_win: number;
    points_for_loss: number;
    points_for_top_scorer: number;
    points_for_assist_king: number;
    points_for_champion: number;
    points_per_relegated_team: number;
  };
  managers: PrivateLeagueManager[];
}

// -----------------------------
// User interface (matches server UserRead)
// -----------------------------
export interface UserState {
  id: string | null;
  email: string | null;
  name: string | null;
  picture: string | null;
  team_name?: string | null;
  fantasy_team_id?: number | null;
  predictions: Record<number, RoundPredictions>; // round_number -> RoundPredictions
  season_predictions: SeasonPredictions;
  points: SeasonPoints;
  private_leagues: PrivateLeague[];
}
