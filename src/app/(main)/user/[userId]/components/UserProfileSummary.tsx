'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface UserSummaryProps {
  totalPoints: number;
  totalGames: number;
  exactCount: number;
  correctCount: number;
  missedCount: number;
  season?: {
    league_champion?: string;
    top_scorer?: string;
    assist_king?: string;
    relegated_teams?: string[];
  };
}

export function UserSummary({
  totalPoints,
  totalGames,
  exactCount,
  correctCount,
  missedCount,
  season,
}: UserSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 mb-6">
      {/* Points Card */}
      <Card className="p-0 gap-0 rounded border-none shadow-none">
        <CardContent className="grid grid-cols-3 px-0 py-0 gap-4">
          <div className="flex items-center justify-center text-center flex-col bg-muted rounded-lg p-2 shadow-md">
            <span>Points</span>
            <span className="font-semibold">{totalPoints}</span>
          </div>
            <div className="flex items-center justify-center text-center flex-col bg-muted rounded-lg p-2 shadow-md">
            <span>Exact</span>
            <span className="font-semibold text-green-600">{exactCount}</span>
          </div>
            <div className="flex items-center justify-center text-center flex-col bg-muted rounded-lg p-2 shadow-md">
            <span>Correct</span>
            <span className="font-semibold text-yellow-600">{correctCount}</span>
          </div>
        </CardContent>
      </Card>
    <Separator />
      {/* Season Predictions Card */}
      {season && (
        <Card className="border-none shadow-none p-2 gap-1">
          <CardHeader className="px-0">
            <CardDescription className="text-lg">
                Season Picks
            </CardDescription>
          </CardHeader>
         <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 px-0">
           <div className="flex items-start justify-center text-center flex-col">
              <Label>League Champion:</Label>
              <span className="font-semibold">{season.league_champion ?? "-"}</span>
            </div>
             <div className="flex items-start justify-center text-center flex-col">
              <Label>Top Scorer:</Label>
              <span className="font-semibold">{season.top_scorer ?? "-"}</span>
            </div>
          <div className="flex items-start justify-center text-center flex-col">
              <Label>Assist King:</Label>
              <span className="font-semibold">{season.assist_king ?? "-"}</span>
            </div>
            <div className="flex md:col-span-3 flex-col items-start">
              <Label>Relegated Teams:</Label>
              <span className="font-semibold">{season.relegated_teams?.join(", ") ?? "-"}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}