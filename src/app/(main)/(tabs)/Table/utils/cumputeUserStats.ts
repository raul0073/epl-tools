import { MatchPoints, RoundPoints, UserState } from "@/types/api/user";

export function computeUserStats(user: UserState) {
  let totalPredictions = 0;
  let exactPredictions = 0;
  let correctPredictions = 0;
  let totalPoints = 0;

  // Count total predictions across all rounds
  Object.values(user.predictions).forEach((round) => {
    totalPredictions += round.matches.length;
  });

  // Sum points across all rounds in user.points
  Object.values(user.points.rounds).forEach((round: RoundPoints) => {
    round.matches.forEach((match: MatchPoints) => {
      totalPoints += match.points;
      if (match.points === 3) exactPredictions += 1;
      else if (match.points === 1) correctPredictions += 1;
    });
  });

  return {
    totalPredictions,
    exactPredictions,
    correctPredictions,
    totalPoints,
  };
}
