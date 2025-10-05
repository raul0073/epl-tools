import { Fixture } from "@/types/api/fixtures";

export function hasMatchData(selectedFixture: Fixture) {
  return (
    (typeof selectedFixture.match_report === "string" &&
      typeof selectedFixture.match_report !== "number") ||
    Number(selectedFixture.match_report) !== 0
  );
}
export function getMatchWinnerClass(awayScore: number, homeScore: number) {
  const awayScoreClass =
    Number(awayScore) > Number(homeScore) ? "font-extrabold" : "";
  const homeScoreClass =
    Number(homeScore) > Number(awayScore) ? "font-extrabold" : "";
  return { homeScoreClass, awayScoreClass };
}
