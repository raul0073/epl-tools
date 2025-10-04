'use client';

import { RootState } from '@/lib/store';
import { Fixture } from '@/types/api/fixtures';
import { useDispatch, useSelector } from 'react-redux';
import { NumberPicker } from './NumberPicker';
import { parseScore } from '@/lib/utils';
import { updatePrediction } from '@/lib/slices/prediction';

interface PredictionCellProps {
  fixture: Fixture;
  team: 'home' | 'away';
}

export const PredictionCell = ({ fixture, team }: PredictionCellProps) => {
  const dispatch = useDispatch();
  const predictionsByRound = useSelector((state: RootState) => state.predictions.predictions);
  const round = fixture.week;

  // --- get the round's matches array ---
  let roundPred = predictionsByRound[round];
  if (!roundPred) {
    roundPred = { matches: [] };
  }

  // --- find existing match ---
  let matchPred = roundPred.matches.find(
    (m) => m.game_id === String(fixture.game_id) || m.game_id === String(fixture.temp_id)
  );

  if (!matchPred) {
    matchPred = {
      game_id: fixture.game_id !== 0 ? String(fixture.game_id) : String(fixture.temp_id),
      home_team: fixture.home_team,
      away_team: fixture.away_team,
      home_score: null,
      away_score: null,
    };
  }

  const [homeScore, awayScore] = parseScore(fixture.score);
  const actualScore = team === 'home' ? homeScore : awayScore;
  const userPred = team === 'home' ? matchPred.home_score : matchPred.away_score;

  const handleChange = (val: number) => {
    const updatedMatch = {
      ...matchPred!,
      home_score: team === 'home' ? val : matchPred!.home_score,
      away_score: team === 'away' ? val : matchPred!.away_score,
    };

    // --- update slice ---
    dispatch(
      updatePrediction({
        round_number: round,
        prediction: updatedMatch,
      })
    );
  };

  // Show finished match
  if (fixture.game_id !== 0 && actualScore !== null) {
    return (
      <div className="w-fit flex items-center justify-between gap-1">
        <div className="flex-col">
          <span className="font-bold">{actualScore}</span>
        </div>
      </div>
    );
  }

  // Not started → NumberPicker
  return <NumberPicker value={userPred ?? null} onChange={handleChange} />;
};
