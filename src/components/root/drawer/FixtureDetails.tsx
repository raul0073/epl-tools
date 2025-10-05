'use client';

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { cn, getCustomDate, isSameTeam, parseScore } from "@/lib/utils";
import { Fixture, FixtureEvent } from "@/types/api/fixtures";
import { EPL_TEAM_LOGO_MAP } from "@/types/local/teamsIconsMapping";
import Image from "next/image";
import { Fragment, useMemo } from "react";
import { GiWhistle } from "react-icons/gi";
import { getEventComp } from "../../../../public/subIcon";
import { getMatchWinnerClass, hasMatchData } from "./_utils";

interface FixtureDrawerProps {
  selectedFixture: Fixture | null;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

export const FixtureDrawer = ({ selectedFixture, drawerOpen, setDrawerOpen }: FixtureDrawerProps) => {
  // Hooks must always run
  const sortedEvents: FixtureEvent[] = useMemo(() => {
    return selectedFixture?.events?.slice().sort((a, b) => Number(a.minute) - Number(b.minute)) ?? [];
  }, [selectedFixture?.events]);

  const [homeScore, awayScore, homeScoreClass, awayScoreClass] = useMemo(() => {
    if (!selectedFixture) return ["-", "-", "", ""];
    const [h, a] = parseScore(selectedFixture.score);
    const { homeScoreClass, awayScoreClass } = getMatchWinnerClass(Number(h), Number(a));
    return [h, a, homeScoreClass, awayScoreClass];
  }, [selectedFixture]);

  const hasData = selectedFixture ? hasMatchData(selectedFixture) : false;

  if (!selectedFixture) return null;

  const { home_team, away_team, venue, referee, attendance, home_xg, away_xg, date, time } = selectedFixture;

  const renderEventRow = (ev: FixtureEvent, idx: number) => {
    const minuteNum = Number(ev.minute);
    const showHalfTimeLine = minuteNum > 45 && (idx === 0 || Number(sortedEvents[idx - 1].minute) <= 45);

    return (
      <Fragment key={idx}>
        {showHalfTimeLine && (
          <div className="relative w-full flex justify-center items-center my-2 overflow-clip">
            <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-6 bg-muted/50 overflow-clip" />
            <Separator className="bg-gradient-to-r from-transparent via-transparent to-input" />
            <span className="relative z-10 text-xs text-muted-foreground font-bold rounded-full px-1 py-1 bg-input">
              HT
            </span>
            <Separator className="bg-gradient-to-r from-input via-transparent to-transparent" />
          </div>
        )}

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 p-1 text-sm relative">
          <div className="relative flex flex-col justify-end items-end gap-1">
            {isSameTeam(ev.team, home_team) && getEventComp(ev, "home")}
          </div>
          <div
            className={cn(
              "text-xs text-center text-muted-foreground relative z-10 rounded-full px-1 py-1 border bg-background shadow-xl",
              ev.event_type === "goal" && "bg-primary text-background"
            )}
          >
            {ev.minute}&apos;
          </div>
          <div className="relative flex flex-col justify-start items-start gap-1">
            {isSameTeam(ev.team, away_team) && getEventComp(ev, "away")}
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent className="py-2 max-h-[90vh] flex flex-col bg-muted">
        <DrawerHeader className="grid grid-cols-3 items-center gap-2 bg-gradient-to-b from-muted to-background p-0 shadow-xl">
          <DrawerTitle className="col-span-3">
            {venue} {attendance && <small>, {new Intl.NumberFormat("he-IL").format(attendance)}</small>}
          </DrawerTitle>
          <DrawerDescription className="text-xs col-span-3">
            {getCustomDate(date)}, {time} <br /> {referee} <GiWhistle className="inline" />
          </DrawerDescription>

          {/* Home Team */}
          <span className="flex justify-center items-center text-right truncate text-sm font-medium">
            <Image src={`/logos/epl/${EPL_TEAM_LOGO_MAP[home_team]}.png`} alt={home_team} width={42} height={42} />
          </span>

          {/* Score & xG */}
          <div className="grid grid-cols-3 w-fit mx-auto">
            <div className="home-score"><span className={homeScoreClass}>{homeScore}</span></div>
            <div className="score-vs">:</div>
            <div className="away-score"><span className={awayScoreClass}>{awayScore}</span></div>
            <div className="home-xg"><small>{home_xg ?? ""}</small></div>
            <div className="xg-vs px-1"><small>xG</small></div>
            <div className="away-xg"><small>{away_xg ?? ""}</small></div>
          </div>

          {/* Away Team */}
          <span className="flex justify-center items-center w-full">
            <Image src={`/logos/epl/${EPL_TEAM_LOGO_MAP[away_team]}.png`} alt={away_team} width={42} height={42} />
          </span>
          <Separator className="col-span-3" />
        </DrawerHeader>

        <div className="pt-4 flex-1 overflow-y-auto relative bg-background pb-12">
          {!hasData ? (
            <div className="w-full flex justify-center text-center">
              Match data is not available at the moment.
            </div>
          ) : (
            <div className="relative px-2">
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-input/60 -translate-x-1/2" />
              <div className="flex flex-col space-y-1 relative z-10">
                {sortedEvents.map(renderEventRow)}
              </div>
            </div>
          )}
        </div>

        <DrawerFooter>
          <DrawerClose className="w-full bg-muted rounded-full p-2" asChild>
            <Button className="rounded-full" variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
