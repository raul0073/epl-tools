import { z } from 'zod';

// ---------------------------
// Schemas
// ---------------------------
export const seasonPredictionSchema = z.object({
  top_scorer: z.string().min(1, 'Required'),
  assist_king: z.string().min(1, 'Required'),
  league_champion: z.string().min(1, 'Required')
});


