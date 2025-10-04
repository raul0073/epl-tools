'use client';

import { setSeasonPredictions } from "@/lib/slices/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { useState } from "react";

interface Player {
    label: string;
    value: string;
    team: string;
    position: string;
    starts?: number;
    goals?: number;
    xG?: number;
    xAG?:number
}

export default function TopScorerPicker({ players }: { players: Player[] }) {
    const dispatch = useDispatch();
    const seasonPredictions = useSelector((state: RootState) => state.currentUser.season_predictions);
    const [searchTopScorer, setSearchTopScorer] = useState("");

    const updateTopScorer = (player: string) => {
        dispatch(setSeasonPredictions({ ...seasonPredictions, top_scorer: player }));
    };

    return (
        <div className="flex flex-col gap-1">
            <Label>Top Scorer:</Label>
            <Command>
                <CommandInput
                    placeholder="Select player..."
                    value={searchTopScorer}
                    defaultValue={seasonPredictions.top_scorer}
                    onValueChange={setSearchTopScorer}
                />
                <CommandList>
                    {searchTopScorer.length >= 2 &&
                        players.filter(p => p.label.toLowerCase().includes(searchTopScorer.toLowerCase()))
                            .map((player, index) => (
                                <CommandItem
                                    key={`${player.value}-${player.team}-top-${index}`}
                                    value={player.label}
                                    onSelect={() => {
                                        updateTopScorer(player.label);
                                        setSearchTopScorer(player.label);
                                    }}
                                    className="flex flex-col items-start border-b"
                                >
                                    <span className="font-semibold">
                                        {player.label} <span className="text-xs text-muted-foreground">({player.position})</span>
                                    </span>
                                    <div className="flex gap-3 text-[.65rem]">
                                        <span>Starts: {player.starts}</span>
                                        <span>Goals: {player.goals}</span>
                                        <span>xG: {player.xG}</span>
                                    </div>
                                </CommandItem>
                            ))}
                </CommandList>
            </Command>
               <div className="mt-1 text-sm text-muted-foreground flex justify-between items-center">
               <div> Selected: <strong>{seasonPredictions.top_scorer || "None"}</strong></div>
               <span> {seasonPredictions.top_scorer && <Check className="text-lime-600 inline" />}</span>
            </div>
        </div>
    );
}
