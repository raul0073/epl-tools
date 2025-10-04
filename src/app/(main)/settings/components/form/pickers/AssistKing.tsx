'use client';

import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { setSeasonPredictions } from "@/lib/slices/user";
import { RootState } from "@/lib/store";
import { Check } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Player {
    label: string;
    value: string;
    team: string;
    position: string;
    starts?: number;
    assists?: number;
    xGA?: number;
}

export default function AssistKingPicker({ players }: { players: Player[] }) {
    const dispatch = useDispatch();
    const seasonPredictions = useSelector((state: RootState) => state.currentUser.season_predictions);
    const [searchAssistKing, setSearchAssistKing] = useState("");

    const updateAssistKing = (player: string) => {
        dispatch(setSeasonPredictions({ ...seasonPredictions, assist_king: player }));
    };

    return (
        <div className="flex flex-col gap-1">
            <Label>Assist King:</Label>
            <Command>
                <CommandInput
                    placeholder="Select player..."
                    value={searchAssistKing}
                    defaultValue={seasonPredictions.assist_king}
                    onValueChange={setSearchAssistKing}
                />
                <CommandList>
                    {searchAssistKing.length >= 2 &&
                        players.filter(p => p.label.toLowerCase().includes(searchAssistKing.toLowerCase()))
                            .map((player, index) => (
                                <CommandItem
                                    key={`${player.value}-${player.team}-assist-${index}`}
                                    value={player.label}
                                    onSelect={() => {
                                        updateAssistKing(player.label);
                                        setSearchAssistKing(player.label);
                                    }}
                                    className="flex flex-col items-start border-b"
                                >
                                    <span className="font-semibold">
                                        {player.label} <span className="text-xs text-muted-foreground">({player.position})</span>
                                    </span>
                                    <div className="flex gap-3 text-[.65rem]">
                                        <span>Starts: {player.starts}</span>
                                        <span>Assists: {player.assists}</span>
                                        <span>xAG: {player.xGA}</span>
                                    </div>
                                </CommandItem>
                            ))}
                </CommandList>
            </Command>
            <div className="mt-1 text-sm text-muted-foreground flex justify-between items-center">
                <div> Selected: <strong>{seasonPredictions.assist_king || "None"}</strong></div>
                <span> {seasonPredictions.assist_king && <Check className="text-lime-600 inline" />}</span>
            </div>
        </div>
    );
}
