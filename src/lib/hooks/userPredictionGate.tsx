// hooks/usePredictionGate.ts
'use client';

import { useEffect, useMemo, useState } from "react";
import { Fixture } from "@/types/api/fixtures";

function parseFixtureDateTime(fixture: Fixture): Date {
  // f.date = "2025-10-03", f.time = "20:00" (UTC)
  const iso = `${fixture.date}T${fixture.time}:00Z`; // UTC ISO
  return new Date(iso);
}

export function usePredictionGate(fixtures: Fixture[]) {
  const gateCloseTime = useMemo(() => {
    if (!fixtures?.length) return null;

    // earliest fixture kickoff in UTC
    const earliestFixture = fixtures.reduce((earliest, f) => {
      const dt = parseFixtureDateTime(f);
      return !earliest || dt < parseFixtureDateTime(earliest) ? f : earliest;
    }, fixtures[0]);

    const kickoffUTC = parseFixtureDateTime(earliestFixture).getTime();
    const gateCloseUTC = kickoffUTC - 90 * 60 * 1000;

    // Convert to Israel local time (Asia/Jerusalem)
    const gateCloseLocal = new Date(
      new Date(gateCloseUTC).toLocaleString("en-US", { timeZone: "Asia/Jerusalem" })
    );

    return gateCloseLocal;
  }, [fixtures]);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isClosed = gateCloseTime ? now >= gateCloseTime : false;
  const timeLeft = gateCloseTime ? gateCloseTime.getTime() - now.getTime() : 0;

  return { isClosed, gateCloseTime, timeLeft };
}
