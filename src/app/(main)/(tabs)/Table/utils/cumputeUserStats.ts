import { UserState } from "@/types/api/user";

export function computeUserStats(user: UserState) {
  let totalPredictions = 0;
  let exactPredictions = 0;
  let correctPredictions = 0;
  let totalPoints = 0;

  // Count total predictions across all rounds (safely)
  const predictions = user.predictions ?? {};
  Object.values(predictions).forEach((round) => {
    const matches = round?.matches ?? [];
    totalPredictions += matches.length;
  });

  // Sum points across all rounds (safely)
  const rounds = user.points?.rounds ?? {};
  //eslint-disable-next-line
  Object.values(rounds).forEach((round: any) => {
    const matches = round?.matches ?? [];
    //eslint-disable-next-line
    matches.forEach((match: any) => {
      const pts = match?.points ?? 0;
      totalPoints += pts;

      if (pts === 3) exactPredictions += 1;
      else if (pts === 1) correctPredictions += 1;
    });
  });

  return {
    totalPredictions,
    exactPredictions,
    correctPredictions,
    totalPoints,
  };
}

// utils for TableTab
import { PrivateLeagueManager } from "@/types/api/user";

export interface LeagueEntry {
  league_id: string;
  name: string;
  admin_id: string;
  //eslint-disable-next-line
  rules: Record<string, any>;
  managers: { user_id: string; team_name: string; points: number }[];
}

/**
 * Build normalized private leagues map from users
 */
export function buildLeagueMap(users: UserState[]): Map<string, LeagueEntry> {
  const map = new Map<string, LeagueEntry>();

  users.forEach((user) => {
    (user.private_leagues ?? []).forEach((l) => {
      const id = l.name
        ? `${l.name}-${l.admin_id ?? "unknown"}`
        : `unknown-${Math.random()}`;
      if (!map.has(id)) {
        map.set(id, {
          league_id: id,
          name: l.name ?? "Unknown League",
          admin_id: l.admin_id ?? "unknown",
          rules: l.rules ?? {},
          managers: [],
        });
      }

      const entry = map.get(id)!;
      const managerSnapshot = (l.managers ?? []).find(
        (m: PrivateLeagueManager) => m.user_id === user.id
      );
      const pointsNumber =
        managerSnapshot?.points?.total_points ?? user.points?.total_points ?? 0;

      entry.managers.push({
        user_id: user.id ?? "",
        team_name: user.team_name ?? user.name ?? "—",
        points: pointsNumber,
      });
    });
  });

  return map;
}

/**
 * Build ordered tab names: EPL Table, Leaderboard, then private leagues
 */
export function buildLeagueTabs(leagueMap: Map<string, LeagueEntry>): string[] {
  const tabs = ["EPL Table", "Leaderboard"];
  Array.from(leagueMap.values()).forEach((league) => {
    const tabName = `${league.name} League`;
    if (!tabs.includes(tabName)) tabs.push(tabName);
  });
  return tabs;
}

/**
 * Sort managers descending by points
 */
export function sortManagersByPoints(managers: LeagueEntry["managers"]) {
  return managers.slice().sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
}
