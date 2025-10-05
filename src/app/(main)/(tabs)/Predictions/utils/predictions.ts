import { Fixture } from "@/types/api/fixtures";

// Group fixtures by day, sorted by time
export function groupFixturesByDay(fixtures: Fixture[]) {
  const grouped = fixtures.reduce<Record<string, Fixture[]>>((acc, f) => {
    const dayKey = new Date(f.date).toISOString().split("T")[0];
    (acc[dayKey] ||= []).push(f);
    return acc;
  }, {});

  Object.keys(grouped).forEach((day) => {
    grouped[day].sort((a, b) => {
      const [aH, aM] = a.time.split(":").map(Number);
      const [bH, bM] = b.time.split(":").map(Number);
      return aH * 60 + aM - (bH * 60 + bM);
    });
  });

  return grouped;
}

// Normalize predictions for API 
//eslint-disable-next-line
export function normalizePredictionsForApi(predictions: Record<number, any>) {
 //eslint-disable-next-line
  const normalized: Record<number, any> = {};
  for (const [roundStr, round] of Object.entries(predictions)) {
    const roundNum = Number(roundStr);
    normalized[roundNum] = {
      ...round, 
      //eslint-disable-next-line
      matches: round.matches.map((m: any) => ({
        ...m,
        home_team: m.home_team ?? undefined,
        away_team: m.away_team ?? undefined,
        home_score: m.home_score ?? undefined,
        away_score: m.away_score ?? undefined,
      })),
    };
  }
  return normalized;
}

// Find prediction for fixture
export function findPrediction( 
  //eslint-disable-next-line
  predictionsByRound: Record<number, any>,
  roundNumber: number,
  gameId: string
) {
  const round = predictionsByRound[roundNumber]; 
  //eslint-disable-next-line
  return round?.matches.find((m: any) => m.game_id === gameId);
}

// Format prediction display
export function normalizePredictionDisplay(pred?: {
  home_score?: number | null;
  away_score?: number | null;
}) {
  if (!pred) return "Not set";
  const home = pred.home_score ?? "–";
  const away = pred.away_score ?? "–";
  return home === "–" && away === "–" ? "Not set" : `${home} - ${away}`;
}
