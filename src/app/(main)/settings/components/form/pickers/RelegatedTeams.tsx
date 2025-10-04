'use client';

import { setSeasonPredictions } from "@/lib/slices/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import Image from "next/image";
import { Check } from "lucide-react";
import { useState } from "react";
import { EPL_TEAMS } from "../../../../../../../public/selectData";

export default function RelegatedTeamsPicker() {
    const dispatch = useDispatch();
    const seasonPredictions = useSelector((state: RootState) => state.currentUser.season_predictions);
    const [searchTeam, setSearchTeam] = useState("");

    const selectedTeams: string[] = seasonPredictions.relegated_teams || [];

    const toggleTeam = (team: string) => {
        let updatedTeams = [...selectedTeams];
        if (selectedTeams.includes(team)) {
            updatedTeams = updatedTeams.filter(t => t !== team);
        } else {
            if (selectedTeams.length < 3) {
                updatedTeams.push(team);
            } else {
                return; // do not allow more than 3
            }
        }
        dispatch(setSeasonPredictions({ ...seasonPredictions, relegated_teams: updatedTeams }));
    };

    return (
        <div className="flex flex-col gap-1">
            <Label>Relegated Teams (pick 3):</Label>
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
                                    onSelect={() => toggleTeam(team.label)}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <Image src={team.logo} alt={team.label} width={16} height={16} className="mr-2" />
                                        {team.label}
                                       
                                    </div>
                                    
                                </CommandItem>
                            ))}
                </CommandList>
            </Command>
            <div className="mt-1 text-sm text-muted-foreground ">
                <div className="flex justify-between items-center"> Selected: {selectedTeams.length === 3 && <Check className="text-lime-600 inline" />}</div>
                {selectedTeams.length > 0 ? (
                    <ul>
                        {selectedTeams.map(t => {
                            return (
                                <li key={t}>{`${t} to be relegated`}</li>
                            )
                        })}
                    </ul>
                ) :(
                    <li key={1}>No teams selected.</li>
                )}
            </div>
             
        </div>
    );
}
