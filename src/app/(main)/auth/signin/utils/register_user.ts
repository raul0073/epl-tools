import { Session } from "next-auth";

export interface CustomSession extends Session {
  user: {
    email: string;
    name: string;
    image: string;
    team_name?: string;

    // predictions keyed by game_id
    predictions?: Record<
      string,
      {
        game_id: string;
        home_team: string;
        away_team: string;
        home_score: number;
        away_score: number;
      }
    >;

    season_predictions?: {
      top_scorer?: string;
      league_champion?: string;
      assist_king?: string;
      relegated_teams?: string[];
      //eslint-disable-next-line
      [key: string]: any;
    };
  };
}

export async function registerUserOnServer(session: CustomSession) {
  const payload = {
    email: session.user.email,
    name: session.user.name,
    picture: session.user.image,
    team_name: session.user.team_name || null, // optional
    predictions: {}, // initialize as empty object keyed by round/game_id
    season_predictions: {
      relegated_teams: [], // ensure array exists
    },
  };

  try {
    const res = await fetch(`/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if(!data.id){
      return null
    }
    return data;
  } catch (err) {
    console.error("Failed to call server:", err);
    return null;
  }
}
