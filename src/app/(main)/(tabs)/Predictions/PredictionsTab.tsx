'use client';

import { Countdown } from "@/components/root/countdown/Coutdown";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { usePredictionGate } from "@/lib/hooks/userPredictionGate";
import { useUpdateUser } from '@/lib/hooks/useUpdateUser';
import { setUser } from '@/lib/slices/user';
import { RootState } from '@/lib/store';
import { cn, formatFixtureStatus, getCustomDate, resolvePredictionScore } from '@/lib/utils';
import { Fixture } from '@/types/api/fixtures';
import { EPL_TEAM_LOGO_MAP } from '@/types/local/teamsIconsMapping';
import Image from "next/image";
import { Dispatch, Fragment, SetStateAction, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PredictionCell } from './PredictionCell';
import { findPrediction, groupFixturesByDay, normalizePredictionsForApi } from "./utils/predictions";

interface PredictionTabProps {
  fixtures: Fixture[];
  round: number | null;
  setRound: Dispatch<SetStateAction<number | null>>;
}

export const PredictionTab = ({ fixtures, round, setRound }: PredictionTabProps) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const predictionsByRound = useSelector((state: RootState) => state.currentUser.predictions);
  const { updateUser, loading } = useUpdateUser();
  const { isClosed, gateCloseTime } = usePredictionGate(fixtures);

  const groupedByDay = useMemo(
    () => groupFixturesByDay(fixtures),
    [fixtures]
  );

  const handleSavePredictions = async () => {
    if (!currentUser?.id) return;
    try {
      const normalizedPredictions = normalizePredictionsForApi(predictionsByRound);
      const updatedUser = { ...currentUser, predictions: normalizedPredictions };
      const res = await updateUser(updatedUser);
      if (res) dispatch(setUser(res));
    } catch (err) {
      console.error(err);
    }
  };

  const prevRound = () => setRound(r => (r ? Math.max(1, r - 1) : 1));
  const nextRound = () => setRound(r => (r ? r + 1 : 1));


  return (
    <div className="space-y-2">
      {/* Round Navigation */}
      <div className="flex items-center justify-between gap-4 bg-gradient-to-b from-muted to-transparent p-2 rounded-md">
        <Button variant="ghost" onClick={prevRound} disabled={!round || round <= 1} className="rounded-full">&lt;</Button>
        <div className="coutdown w-full flex justify-center flex-col items-center text-center">
          <h2 className="text-lg font-semibold">GW {round ?? '-'}</h2>
          <Countdown target={gateCloseTime} />
        </div>
        <Button variant="ghost" onClick={nextRound} disabled={!round} className="rounded-full">&gt;</Button>
      </div>

      {/* Fixtures Table */}
      {Object.entries(groupedByDay).map(([day, dayFixtures]) => (
        <Card key={day} className="p-3 w-full border-none gap-0 shadow-none bg-transparent rounded">
          <CardContent className="p-0">
            <CardDescription className="text-xs text-center font-bold mb-1 border-b-2 w-full bg-muted p-0 gap-0">
              {getCustomDate(day)}
            </CardDescription>
            <Table className="rounded-none">
              <TableBody>
                {dayFixtures.map((f, idx) => {
                  const fixtureKey = Number(f.game_id) === 0 ? f.temp_id : f.game_id;
                  const pred =
                    round !== null ? findPrediction(predictionsByRound, round, String(fixtureKey)) : undefined


                  const { isFinished, homeScoreClass, awayScoreClass, homeScoreStr, awayScoreStr } = formatFixtureStatus(f);
                  const homeScore = Number(homeScoreStr);
                  const awayScore = Number(awayScoreStr);
                  const points =
                    isFinished && pred
                      ? resolvePredictionScore(
                        { home_score: homeScore, away_score: awayScore },
                        { home_score: pred?.home_score ?? 0, away_score: pred?.away_score ?? 0 }
                      )?.points ?? 0
                      : null;
                  const pointsString = points !== null ? `+${points}` : '-';

                  return (
                    <Fragment key={fixtureKey}>
                      {/* Main fixture row */}
                      <TableRow>
                        <TableCell className="text-xs w-12 p-1 text-muted-foreground">{f.time}</TableCell>
                        <TableCell className="flex justify-between p-1 gap-1 items-center border-b border-input/40">
                          <div className="flex items-center gap-2">
                            <Image
                              src={`/logos/epl/${EPL_TEAM_LOGO_MAP[f.home_team]}.png`}
                              alt={f.home_team}
                              width={16}
                              height={16}
                            />
                            <span className={homeScoreClass}>{f.home_team}</span>
                          </div>
                          <PredictionCell fixture={f} team="home" />
                        </TableCell>
                        <TableCell className="flex justify-between p-1 gap-1 items-center">
                          <div className="flex items-center gap-2">
                            <Image
                              src={`/logos/epl/${EPL_TEAM_LOGO_MAP[f.away_team]}.png`}
                              alt={f.away_team}
                              width={16}
                              height={16}
                            />
                            <span className={awayScoreClass}>{f.away_team}</span>
                          </div>
                          <PredictionCell fixture={f} team="away" />
                        </TableCell>
                      </TableRow>

                      {/* Full-width prediction/points row */}
                      <tr className="mb-2">
                        <td colSpan={3} className="p-2 bg-muted/40">
                          <div className="flex flex-col md:flex-row justify-between gap-2 w-full">
                            <div className="flex gap-2 items-center">
                              <span className="text-xs text-muted-foreground">Your prediction:</span>
                              <span>{pred?.home_score} : {pred?.away_score}</span>
                            </div>
                            {points !== null && (
                              <div>
                                Total points{' '}
                                <span className={cn(points > 0 && 'text-blue-600', points > 2 && 'text-lime-500')}>
                                  {!isFinished ? 'Not started' : pointsString}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}

              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Save Button */}
      <div className="form-button my-4 px-4">
        <Button
          onClick={handleSavePredictions}
          disabled={loading || isClosed}
          className="rounded-full w-full flex items-center my-4"
        >
          {loading ? "Saving..." : (isClosed ? "Predictions Closed" : "Save All Predictions")}
        </Button>
      </div>
    </div>
  );
};
