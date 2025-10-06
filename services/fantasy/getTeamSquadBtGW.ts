import { FantasyTeamPicksResponse } from "@/types/api/fantasy_player";

export async function getTeamSquadByGameweek(teamId: number, gw: number) {
  const lastGW = gw - 1;
  console.log("SERVICE GO :", teamId, gw);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/fantasy/${teamId}/team-picks/${lastGW}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch team picks for gw ${gw}`);
    return (await res.json()) as FantasyTeamPicksResponse;
  } catch (err) {
    console.error(err);
    return null;
  }
}
