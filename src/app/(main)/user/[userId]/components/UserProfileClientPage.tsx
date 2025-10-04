'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import UserProfileHeaderPublic from "./UserProfileHeaderPublic";
import { UserSummary } from "./UserProfileSummary";
import { MatchPrediction, UserState } from "@/types/api/user";
import { Predictions } from "@/lib/slices/prediction";


export type PredictionsByRound = Record<string, Record<string, MatchPrediction>>;


export default function UserProfileWrapper({ viewedUser }: { viewedUser: UserState | string }) {
  const currentUser = useSelector((state: RootState) => state.currentUser);

  if (typeof viewedUser === "string") {
    return <div>Error: {viewedUser}</div>;
  }

  const isCurrentUser = currentUser?.id === viewedUser.id;

  // Flatten all games
  const allGames: MatchPrediction[] = Object.values(viewedUser.predictions || {}).flatMap((games) =>
    Object.values(games)
  );

  // Compute season totals
  const totalPoints = allGames.reduce((acc, g) => acc + (g.points ?? 0), 0);
  const totalGames = allGames.length;
  const exactCount = allGames.filter((g) => g.points === 3).length;
  const correctCount = allGames.filter((g) => g.points === 1).length;
  const missedCount = allGames.filter((g) => g.points === 0).length;

  const season = viewedUser.season_predictions;

  return (
    <div className="p-6 space-y-4">
      <UserProfileHeaderPublic user={viewedUser} />

      <UserSummary
        totalPoints={totalPoints}
        totalGames={totalGames}
        exactCount={exactCount}
        correctCount={correctCount}
        missedCount={missedCount}
        season={season}
      />

      <Separator />
      {/* --- Predictions History --- */}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Predictions History</h2>

        {Object.keys(viewedUser.predictions || {}).length > 0 ? (
          <Accordion type="single" collapsible>
           {Object.entries(viewedUser.predictions || {}).map(([roundStr, roundPred]) => {
  const round = Number(roundStr);

  // Convert matches array to record keyed by game_id
  const gamesById: Record<string, typeof roundPred.matches[0]> = {};
  roundPred.matches.forEach((m) => {
    gamesById[m.game_id] = m;
  });

  // Compute round total
  const roundTotal = Object.values(gamesById).reduce((acc, g) => acc + (g.points ?? 0), 0);

  return (
    <AccordionItem key={round} value={`round-${round}`}>
      <AccordionTrigger>
        Round {round} {roundTotal > 0 && <span className="ml-2 text-blue-600 font-semibold">({roundTotal} pts)</span>}
      </AccordionTrigger>
      <AccordionContent className="space-y-2">
        {Object.values(gamesById).map((pred) => (
          <div key={pred.game_id} className="flex justify-between p-2 bg-muted/20 rounded-md">
            <span>
              {pred.home_team ?? "-"} {pred.home_score ?? "-"} : {pred.away_score ?? "-"} {pred.away_team ?? "-"}
            </span>
            <span className="font-semibold text-blue-600">+{pred.points ?? 0}</span>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
})}
          </Accordion>
        ) : (
          <p>No predictions yet</p>
        )}
      </div>
    </div>
  );
}
