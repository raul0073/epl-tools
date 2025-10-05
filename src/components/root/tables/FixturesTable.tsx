'use client';

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { MatchPrediction } from "@/lib/slices/prediction";
import { RootState } from "@/lib/store";
import { cn, formatFixtureStatus, getCustomDate, parseScore } from "@/lib/utils";
import { Fixture } from "@/types/api/fixtures";
import { EPL_TEAM_LOGO_MAP } from "@/types/local/teamsIconsMapping";
import Image from "next/image";
import { Fragment, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FixtureDrawer } from "../drawer/FixtureDetails";

interface FixturesTableProps {
  fixtures: Fixture[];
}

interface EnrichedFixture extends Fixture {
  _status: ReturnType<typeof formatFixtureStatus>;
  _userPrediction: MatchPrediction | null;
}

export const FixturesTable = ({ fixtures }: FixturesTableProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);

  const userPredictions = useSelector(
    (state: RootState) => state.currentUser.predictions
  );

  const normalizePrediction = (pred?: { home_score?: number | null; away_score?: number | null } | null) => {
    if (!pred) return null;
    const home = pred.home_score != null ? String(pred.home_score) : "-";
    const away = pred.away_score != null ? String(pred.away_score) : "-";
    if (home === "-" && away === "-") return null;
    return `${home} - ${away}`;
  };

  const groupedByDay = useMemo(() => {
    const enriched = fixtures.map((f) => {
      const _status = formatFixtureStatus(f);

      const roundPreds = userPredictions?.[f.week]?.matches ?? [];
      const key = f.temp_id ?? String(f.game_id);
      const _userPrediction =
        roundPreds.find((m) => m.game_id === key) ?? null;

      return { ...f, _status, _userPrediction };
    });

    const grouped = enriched.reduce<Record<string, EnrichedFixture[]>>(
      (acc, f) => {
        const dayKey = new Date(f.date).toISOString().split("T")[0];
        if (!acc[dayKey]) acc[dayKey] = [];
        acc[dayKey].push(f);
        return acc;
      },
      {}
    );

    // Sort fixtures inside each day by time
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => {
        // assuming f.time is like "20:45" or "14:00"
        const [aH, aM] = a.time.split(":").map(Number);
        const [bH, bM] = b.time.split(":").map(Number);
        return aH * 60 + aM - (bH * 60 + bM);
      });
    });

    return grouped;
  }, [fixtures, userPredictions]);

  const openDrawer = (f: Fixture) => {
    setSelectedFixture(f);
    setDrawerOpen(true);
  };

  return (
    <>
      <div>
        {Object.entries(groupedByDay).map(([day, dayFixtures]) => (
          <Card key={day} className="p-1 w-full border-none shadow-none bg-transparent rounded">
            <CardHeader className="p-0 text-center gap-0">
              <CardDescription className="text-xs font-bold border-b-2 w-full bg-muted">
                {getCustomDate(day)}
              </CardDescription></CardHeader>
            <CardContent className="p-0">
              <Table className="py-0 my-0">
                <TableBody>
                  {dayFixtures.map((f) => {
                    const { isFinished, homeScoreClass, awayScoreClass, time, statusDisplay } = f._status;
                    const predictionString = normalizePrediction(f._userPrediction);

                    const [homeScore, awayScore] = parseScore(f.score);

                    return (
                      <Fragment key={f.temp_id ?? `${String(f.game_id)}-${f.home_team}_vs_${f.away_team}`}>
                        <TableRow
                          className="p-4 cursor-pointer my-1"
                          onClick={() => openDrawer(f)}
                        >
                          <TableCell className="text-xs w-fit p-0 text-muted-foreground">{time}</TableCell>

                          <TableCell className="grid grid-cols-2 p-1 gap-1">
                            <div className="flex items-center gap-2">
                              <Image
                                src={`/logos/epl/${EPL_TEAM_LOGO_MAP[f.home_team]}.png`}
                                alt={f.home_team}
                                width={16}
                                height={16}
                              />
                              <span className={homeScoreClass}>{f.home_team}</span>
                            </div>
                            <div className={`flex justify-end ${homeScoreClass}`}>{homeScore}</div>
                          </TableCell>

                          <TableCell className="grid grid-cols-3 p-1 gap-1">
                            <div className="flex items-center gap-2 col-span-2">
                              <Image
                                src={`/logos/epl/${EPL_TEAM_LOGO_MAP[f.away_team]}.png`}
                                alt={f.away_team}
                                width={16}
                                height={16}
                              />
                              <span className={awayScoreClass}>{f.away_team}</span>
                            </div>
                            <div className={`flex justify-end ${awayScoreClass}`}>{awayScore}</div>
                          </TableCell>

                          <TableCell
                            className={cn(
                              "w-[2%] text-[.6rem] text-right p-0",
                              !isFinished && "text-center"
                            )}
                          >

                          </TableCell>
                        </TableRow>

                        <TableRow className="border-b-2 border-input/60 py-1 px-0 gap-0 my-0 bg-muted/60">
                          <TableCell colSpan={3} className="text-xs">
                            <div className="w-full flex justify-between"><span>  Your prediction:</span> <span>{predictionString ?? "Is not set."}</span></div>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      <FixtureDrawer
        selectedFixture={selectedFixture}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </>
  );
};
