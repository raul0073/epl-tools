"use client";

import { FixtureEvent } from "@/types/api/fixtures";
import React from "react";

interface TimelineProps {
    events: FixtureEvent[];
    homeTeam: string;
    awayTeam: string;
}

const MatchTimeline: React.FC<TimelineProps> = ({ events, homeTeam, awayTeam }) => {
    // sort events by minute number
    const sorted = [...events].sort(
        (a, b) => Number(a.minute) - Number(b.minute)
    );
    const normalized = sorted.map(ev => ({
        ...ev,
        side: ev.team.toLowerCase() === homeTeam.toLowerCase() ? "home" : "away"
    }));
    const renderEventText = (ev: FixtureEvent) => {
        let text = ev.player1;
        if (ev.player2) text += ` → ${ev.player2}`;
        return (
            <>
                <p className="font-medium">{text}</p>
                <p className="text-xs capitalize">{ev.event_type}</p>
                {ev.score && (
                    <p className="text-xs font-bold text-primary">{ev.score}</p>
                )}
            </>
        );
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between mb-4 text-sm font-bold text-muted-foreground">
                <span>{homeTeam}</span>
                <span>{awayTeam}</span>
            </div>

            <div className="relative">
                {/* central line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-300 -translate-x-1/2" />

                <ul className="space-y-6">
                    {sorted.map((ev, idx) => (
                        <li key={idx} className="flex items-center">
                            {ev.team.toLowerCase() === homeTeam.toLowerCase() ? (
                                <>
                                    {/* Home side */}
                                    <div className="w-1/2 pr-4 flex justify-end">
                                        <div className="bg-primary/10 rounded-lg px-3 py-2 text-sm text-right shadow">
                                            {renderEventText(ev)}
                                        </div>
                                    </div>
                                    {/* timeline dot */}
                                    <div className="relative">
                                        <div className="w-3 h-3 bg-primary rounded-full border border-white shadow" />
                                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold">
                                            {ev.minute}&apos;
                                        </span>
                                    </div>
                                    <div className="w-1/2" />
                                </>
                            ) : (
                                <>
                                    <div className="w-1/2" />
                                    {/* timeline dot */}
                                    <div className="relative">
                                        <div className="w-3 h-3 bg-secondary rounded-full border border-white shadow" />
                                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold bg-muted">
                                            {ev.minute}&apos;
                                        </span>
                                    </div>
                                    {/* Away side */}
                                    <div className="w-1/2 pl-4 flex justify-start">
                                        <div className="bg-secondary/10 rounded-lg px-3 py-2 text-sm text-left shadow">
                                            {renderEventText(ev)}
                                        </div>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MatchTimeline;
