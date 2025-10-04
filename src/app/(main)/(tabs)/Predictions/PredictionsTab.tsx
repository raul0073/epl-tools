'use client';

import { Countdown } from "@/components/root/countdown/Coutdown";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table';
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

interface PredictionTabProps {
  fixtures: Fixture[];
  round: number | null;
  setRound: Dispatch<SetStateAction<number | null>>;
}

export const PredictionTab = ({ fixtures, round, setRound }: PredictionTabProps) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const predictionsByRound = useSelector((state: RootState) => state.predictions.predictions);
  const { updateUser, loading } = useUpdateUser();
  const { isClosed, gateCloseTime } = usePredictionGate(fixtures);

  // Group fixtures by day
  const groupedByDay = useMemo(() => {
    return fixtures.reduce<Record<string, Fixture[]>>((acc, f) => {
      const dayKey = new Date(f.date).toISOString().split('T')[0];
      (acc[dayKey] ||= []).push(f);
      return acc;
    }, {});
  }, [fixtures]);

  const prevRound = () => setRound(r => (r ? Math.max(1, r - 1) : 1));
  const nextRound = () => setRound(r => (r ? r + 1 : 1));

  // Normalize predictions for API
  const normalizePredictionsForApi = (predictions: typeof predictionsByRound) => {
    //eslint-disable-next-line
    const normalized: Record<number, any> = {};
    for (const [roundStr, round] of Object.entries(predictions)) {
      const roundNum = Number(roundStr);
      normalized[roundNum] = {
        ...round,
        matches: round.matches.map(m => ({
          ...m,
          home_team: m.home_team ?? undefined,
          away_team: m.away_team ?? undefined,
          home_score: m.home_score ?? undefined,
          away_score: m.away_score ?? undefined,
        })),
      };
    }
    return normalized;
  };

  const handleSavePredictions = async () => {
    if (!currentUser?.id) return;
    try {
      const normalizedPredictions = normalizePredictionsForApi(predictionsByRound);

      const updatedUser = {
        ...currentUser,
        predictions: normalizedPredictions,
      };

      const res = await updateUser(updatedUser);
      if (res) dispatch(setUser(res));
    } catch (err) {
      console.error(err);
    }
  };

  const findPrediction = (roundNumber: number, gameId: string) => {
    const round = predictionsByRound[roundNumber];
    return round?.matches.find(m => m.game_id === gameId);
  };

  const normalizePredictionDisplay = (pred?: { home_score?: number | null; away_score?: number | null }) => {
    if (!pred) return 'Not set';
    const home = pred.home_score ?? '–';
    const away = pred.away_score ?? '–';
    return home === '–' && away === '–' ? 'Not set' : `${home} - ${away}`;
  };

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
            <TableCaption className="text-xs font-bold mb-1 border-b-2 w-full bg-muted p-0 gap-0">
              {getCustomDate(day)}
            </TableCaption>
            <Table className="rounded-none">
              <TableBody>
                {dayFixtures.map((f, idx) => {
                  const fixtureKey = f.game_id ?? f.temp_id ?? `${f.home_team}-${f.away_team}-${idx}`;
                  const pred = round !== null ? findPrediction(round, String(fixtureKey)) : undefined;
                  const { isFinished, homeScoreClass, awayScoreClass, homeScoreStr, awayScoreStr } = formatFixtureStatus(f);
                  const homeScore = Number(homeScoreStr);
                  const awayScore = Number(awayScoreStr);
                  const matchPrediction = normalizePredictionDisplay(pred);
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
                      <TableRow className="p-1">
                        {/* Home Team */}
                        <TableCell className="flex justify-between p-1 gap-1 items-center">
                          <div className="flex items-center gap-2">
                            <Image src={`/logos/epl/${EPL_TEAM_LOGO_MAP[f.home_team]}.png`} alt={f.home_team} width={16} height={16} />
                            <span className={homeScoreClass}>{f.home_team}</span>
                          </div>
                          <PredictionCell fixture={f} team="home" />
                        </TableCell>

                        {/* Away Team */}
                        <TableCell className="flex justify-between p-1 gap-1 items-center">
                          <div className="flex items-center gap-2">
                            <Image src={`/logos/epl/${EPL_TEAM_LOGO_MAP[f.away_team]}.png`} alt={f.away_team} width={16} height={16} />
                            <span className={awayScoreClass}>{f.away_team}</span>
                          </div>
                          <PredictionCell fixture={f} team="away" />
                        </TableCell>

                        {/* Prediction & Points */}
                        <TableCell colSpan={2} className="text-sm flex justify-between items-center gap-4 w-full bg-muted/60 p-2">
                          <span className="text-muted-foreground flex gap-2 justify-between w-full">
                            Your prediction: <span>{matchPrediction}</span>
                          </span>
                          {points !== null && (
                            <span>
                              Total points{' '}
                              <span className={cn(points > 0 && 'text-blue-600', points > 2 && 'text-lime-500')}>
                                {!isFinished ? 'Not started' : pointsString}
                              </span>
                            </span>
                          )}
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
