'use client';

import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { setSeasonPredictions } from "@/lib/slices/user";
import { RootState } from "@/lib/store";
import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EPL_TEAMS } from "../../../../../../../public/selectData";

export default function LeagueChampionPicker() {
    const dispatch = useDispatch();
    const seasonPredictions = useSelector((state: RootState) => state.currentUser.season_predictions);
    const [searchTeam, setSearchTeam] = useState("");

    const updateChampion = (team: string) => {
        dispatch(setSeasonPredictions({ ...seasonPredictions, league_champion: team }));
    };

    return (
        <div className="flex flex-col gap-1">
            <Label>League Champion:</Label>
            <Command>
                <CommandInput
                    placeholder="Select team..."
                    value={searchTeam}
                    defaultValue={seasonPredictions.league_champion}
                    onValueChange={setSearchTeam}
                />
                <CommandList>
                    {searchTeam.length >= 2 &&
                        EPL_TEAMS.filter(t => t.label.toLowerCase().includes(searchTeam.toLowerCase()))
                            .map(team => (
                                <CommandItem
                                    key={team.value}
                                    value={team.label}
                                    onSelect={() => {
                                        updateChampion(team.label);
                                        setSearchTeam(team.label);
                                    }}
                                >
                                    <span>
                                        <Image src={team.logo} alt={team.label} width={16} height={16} className="mr-2" />
                                    </span>
                                    {team.label}
                                </CommandItem>
                            ))}
                </CommandList>
            </Command>
            <div className="mt-1 text-sm text-muted-foreground flex justify-between items-center">
                <div> Selected: <strong>{seasonPredictions.league_champion || "None"}</strong></div>
                <span> {seasonPredictions.league_champion && <Check className="text-lime-600 inline" />}</span>
            </div>
        </div>
    );
}
