import { Fixture } from "@/types/api/fixtures";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getRelativeTime(date: string | Date): string {
  if(!date) return ""
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  const timeStr = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  if (diffSec < 60) return `just now at ${timeStr}`;
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago at ${timeStr}`;
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago at ${timeStr}`;
  if (diffDays === 1) return `yesterday at ${timeStr}`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago at ${timeStr}`;

  // fallback: return full date
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", weekday: "short" }) + ` at ${timeStr}`;
}


export function getStringDate(date: string){
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
  })
}

export type DateFormat = "long" | "short" | "dayOnly";

export function getCustomDate(date: string | Date, format: DateFormat = "long"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  switch (format) {
    case "long":
      return d.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }); // e.g., "Friday, 18 Oct"
    case "short":
      return d.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }); // e.g., "Fri, 18 Oct"
    case "dayOnly":
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); // e.g., "18 Oct"
    default:
      return d.toLocaleDateString("en-GB");
  }
}


interface Prediction {
  home_score: number | null;
  away_score: number | null;
}

interface Result {
  points: 0 | 1 | 3;
  exactScore: boolean;
  correctOutcome: boolean;
}

/**
 * Resolves points for a user's prediction against actual match score.
 */
export function resolvePredictionScore(
  actual: { home_score: number; away_score: number },
  prediction: Prediction
): Result {
  if (prediction.home_score === null || prediction.away_score === null) {
    return { points: 0, exactScore: false, correctOutcome: false };
  }

  const exactScore =
    Number(prediction.home_score) === Number(actual.home_score) &&
    Number(prediction.away_score) === Number(actual.away_score);

  if (exactScore) {
    return { points: 3, exactScore: true, correctOutcome: true };
  }

  const actualOutcome =
    actual.home_score > actual.away_score
      ? "home"
      : actual.home_score < actual.away_score
      ? "away"
      : "draw";

  const predictedOutcome =
    prediction.home_score > prediction.away_score
      ? "home"
      : prediction.home_score < prediction.away_score
      ? "away"
      : "draw";

  const correctOutcome = actualOutcome === predictedOutcome;

  return {
    points: correctOutcome ? 1 : 0,
    exactScore: false,
    correctOutcome,
  };
}

export const parseScore = (score?: string | number): [string, string] => {
  if (score === 0) return ["-", "-"];
  // Replace all dash variants with normal hyphen
  const normalized = String(score).replace(/[\u2012\u2013\u2014\u2212]/g, "-").replace(/\s+/g, "");
  const parts = normalized.split("-");
  if (parts.length !== 2) return ["-", "-"];
  return [parts[0], parts[1]];
};

export function formatFixtureStatus(f: Fixture) {
  const isFinished = f.score !== 0 && String(f.score).trim() !== "";
  const [homeScoreStr, awayScoreStr] = parseScore(String(f.score));
  const homeScore = Number(homeScoreStr);
  const awayScore = Number(awayScoreStr);

  let winner: string | null = null;
  let isDraw = false;

  if (isFinished) {
    if (!isNaN(homeScore) && !isNaN(awayScore)) {
      if (homeScore === awayScore) isDraw = true;
      else if (homeScore > awayScore) winner = f.home_team;
      else winner = f.away_team;
    }
  }

  const homeScoreClass = isDraw ? "font-base" : winner === f.home_team ? "font-bold" : "";
  const awayScoreClass = isDraw ? "font-base" : winner === f.away_team ? "font-bold" : "";

  // Correct Israel time
  const dateTimeStr = `${f.date}T${f.time}:00Z`;
  const dateObj = new Date(dateTimeStr);
  const time = dateObj.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const stringDate = getStringDate(f.date);
  const relativeTime = getRelativeTime(f.date);
  const statusDisplay = isFinished ? "" : "TBD";

  return { isFinished, homeScoreClass, awayScoreClass, time, stringDate, relativeTime, statusDisplay, homeScoreStr, awayScoreStr };
}
const TEAM_ALIASES: Record<string, string[]> = {
  "arsenal": ["arsenal", "gunners"],
  "aston villa": ["aston villa", "villa"],
  "bournemouth": ["afc bournemouth", "cherries"],
  "brentford": ["brentford", "bees"],
  "brighton & hove albion": ["brighton", "seagulls"],
  "chelsea": ["chelsea", "blues"],
  "crystal palace": ["crystal palace", "palace"],
  "everton": ["everton", "toffees"],
  "fulham": ["fulham", "cottagers"],
  "liverpool": ["liverpool", "reds"],
  "leeds united": ["leeds", "leeds utd", "whites"],
  "leicester city": ["leicester", "foxes"],
  "manchester city": ["man city", "manchester c", "city", "citizens"],
  "manchester united": ["man utd", "manchester utd", "man u", "man united", "united"],
  "newcastle united": ["newcastle", "newcastle utd", "magpies"],
  "nott'ham forest": ["nottingham forest", "forest", "reds"],
  "sheffield united": ["sheffield utd", "blades"],
  "southampton": ["southampton", "saints"],
  "tottenham hotspur": ["tottenham", "spurs", "tottenham hotspur"],
  "west ham united": ["west ham", "hammers"],
  "wolverhampton wanderers": ["wolves", "wolverhampton"],
};

/**
 * Returns true if two team names refer to the same team
 */
export function isSameTeam(teamA: string, teamB: string) {
  if (!teamA || !teamB) return false;

  const normalize = (name: string) => name.trim().toLowerCase();

  const a = normalize(teamA);
  const b = normalize(teamB);

  // Exact match
  if (a === b) return true;

  // Check aliases
  for (const [canonical, aliases] of Object.entries(TEAM_ALIASES)) {
    if ([canonical, ...aliases].includes(a) && [canonical, ...aliases].includes(b)) {
      return true;
    }
  }

  // One contains the other
  if (a.includes(b) || b.includes(a)) return true;

  return false;
}
