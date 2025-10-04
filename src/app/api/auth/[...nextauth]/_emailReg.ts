import { config } from "@/lib/config";
import client from "@/lib/db/mongodb";
import { MatchPrediction, SeasonPoints, SeasonPredictions } from '@/types/api/user';

interface UserCreate {
  email: string;
  name?: string;
  team_name?: string;
  picture?: string;
  predictions?: Record<string, Record<string, MatchPrediction>>;
  season_predictions?: SeasonPredictions
  points?: SeasonPoints;
}

export async function getOrCreateUser(email: string, name?: string) {
  const db = client.db("epl");

  // Try to find existing user
  let user = await db.collection("users").findOne({ email });

  if (!user) {
    // Create user in Mongo
    const result = await db.collection("users").insertOne({
      email,
      name: name || email.split("@")[0],
      createdAt: new Date(),
    });
    user = { _id: result.insertedId, email, name: name || email.split("@")[0] };

    // Call FastAPI server to register user with full schema
    const payload: UserCreate = {
      email: user.email,
      name: user.name,
      predictions: {},
      season_predictions: {},
      points: {
        total_points: 0,
        rounds: [],
        top_scorer: 0,
        league_champion: 0,
        assist_king: 0,
        relegated_teams: {}
      },
    };

    try {
      await fetch(`${config.SERVER_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to sync user to FastAPI:", err);
    }
  }

  return user;
}
