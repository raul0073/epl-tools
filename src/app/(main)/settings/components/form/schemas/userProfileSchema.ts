import z from "zod";

// 1️⃣ Define Zod schema
export const fantasyTeamSchema = z.object({
  fantasy_team_id: z
    .string()
    .regex(/^\d+$/, "Fantasy Team ID must be numbers only")
    .min(1, "Fantasy Team ID is required"),
});

export type FantasyTeamType = z.infer<typeof fantasyTeamSchema>;
