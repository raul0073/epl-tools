"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUpdateUser } from "@/lib/hooks/useUpdateUser";
import { RootState } from "@/lib/store";
import { Player } from "@/types/local/player";
import { Loader2, SaveAllIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import AssistKingPicker from "./pickers/AssistKing";
import LeagueChampionPicker from "./pickers/LeagueChampion";
import RelegatedTeamsPicker from "./pickers/RelegatedTeams";
import TopScorerPicker from "./pickers/TopScorerPicker";
import { seasonPredictionSchema } from "./schemas/seasonPredictionSchema";


export default function SeasonPredictionEditor() {
  const seasonPredictions = useSelector(
    (state: RootState) => state.currentUser.season_predictions
  );
  const currentUser = useSelector((state: RootState) => state.currentUser);

  const [players, setPlayers] = useState<Player[]>([]);
  const { updateUser, loading } = useUpdateUser();

  // Fetch players
  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch("/api/players");
        if (!res.ok) throw new Error("Failed to fetch players");
        const data: Player[] = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load players");
      }
    }
    fetchPlayers();
  }, []);

  async function handleSave() {
    const topScorerValid = players.some(
      (p) => p.label === seasonPredictions.top_scorer
    );
    const assistKingValid = players.some(
      (p) => p.label === seasonPredictions.assist_king
    );

    if (!topScorerValid || !assistKingValid || !seasonPredictions.league_champion) {
      toast.error("Please select valid players and a team");
      return;
    }

    try {
      // Validate season predictions
      seasonPredictionSchema.parse(seasonPredictions);

      // Prepare updated user object
      const updatedUser = {
        ...currentUser,
        season_predictions: seasonPredictions,
      };

      // Call hook to update Redux + server
      await updateUser(updatedUser);

    } catch (err) {
      console.error(err);
      toast.error("Failed to save season predictions");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <LeagueChampionPicker />
      <Separator />
      <TopScorerPicker players={players} />
      <Separator />
      <AssistKingPicker players={players} />
      <RelegatedTeamsPicker />
      <Button
        onClick={handleSave}
        disabled={loading}
        className="rounded-full w-full flex items-center my-4"
      >
        {loading ? (
          <span className="flex gap-4 items-center">
            <Loader2 className="animate-spin inline" aria-describedby="Saving predictions" />
            <span>Saving...</span>
          </span>
        ) : (
          <span className="flex gap-4 items-center">
            <SaveAllIcon aria-describedby="Saving predictions" />
            <span>Save My Predictions</span>
          </span>
        )}
      </Button>
    </div>
  );
}
