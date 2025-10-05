export type FixtureEvent = {
  team: string;
  minute: string;
  score: string;
  player1: string;
  player2: string | null;
  event_type: string;
};

export type Fixture = {
  week: number;
  day: string;
  date: string; // ISO date string "YYYY-MM-DD"
  time: string; // e.g., "17:30"
  home_team: string;
  home_xg: number;
  score: string | number; // e.g., "0–4"
  away_xg: number;
  away_team: string;
  attendance: number;
  venue: string;
  referee: string;
  match_report: string; // relative URL string
  notes: number | string | null;
  game_id: string | number;
  events: FixtureEvent[];
  enriched: boolean;
  temp_id?: string;
};

export interface FixturesApiResponse {
  meta: {
    last_updated: string;
    round: number;
    season: number;
  };
  fixtures: Fixture[];
}
