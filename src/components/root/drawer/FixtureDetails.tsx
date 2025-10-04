'use client';

import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { getCustomDate, parseScore } from "@/lib/utils";
import { Fixture, FixtureEvent } from "@/types/api/fixtures";

interface FixtureDrawerProps {
  selectedFixture: Fixture | null;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

export const FixtureDrawer = ({ selectedFixture, drawerOpen, setDrawerOpen }: FixtureDrawerProps) => {
  if (!selectedFixture) return null;

  const { home_team, away_team, score, events } = selectedFixture;

  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal": return "⚽";
      case "own_goal": return "🥅";
      case "yellow_card": return "🟨";
      case "red_card": return "🟥";
      case "substitute_in": return "🔄";
      case "substitute_out": return "🔄";
      default: return "";
    }
  };

  // Sort events chronologically
  const sortedEvents: FixtureEvent[] = events.slice().sort((a, b) => Number(a.minute) - Number(b.minute));
  const [homeScore, awayScore] = parseScore(score)
  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent className="p-4 h-[90vh] flex flex-col">
        <DrawerHeader className="flex flex-col items-center">
          <DrawerTitle className="text-center">
            {home_team}  <small className="text-muted-foreground">({selectedFixture.home_xg ?? ""})</small>{homeScore} : {awayScore} <small className="text-muted-foreground">({selectedFixture.away_xg ?? ""})</small> {away_team}
          </DrawerTitle>
          <DrawerDescription>
            {getCustomDate(selectedFixture.date)}, {selectedFixture.time}
          </DrawerDescription>
        </DrawerHeader>

        <div className="mt-4 flex-1 overflow-y-auto">
          <h4 className="font-semibold text-center mb-2">Match Timeline</h4>
          <div className="flex flex-col space-y-1">
            {sortedEvents.map((ev, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-muted p-1 text-sm">
                {/* Home team */}
                <div className="flex flex-col justify-end items-end gap-1">
                  {ev.team === home_team && (
                    <>
                    <div>  <span className="font-semibold">{ev.player1}</span>     <span>{getEventIcon(ev.event_type)}</span></div>
                      {ev.player2 && <span className="text-xs text-muted-foreground">({ev.player2})</span>}
                  
                    </>
                  )}
                </div>

                {/* Minute */}
                <div className="text-xs text-center text-muted-foreground">{ev.minute}&apos;</div>

                {/* Away team */}
                <div className="flex flex-col justify-end items-start gap-1">
                  {ev.team === away_team && (
                    <>
                      <div className="flex gap-2"><span>{getEventIcon(ev.event_type)}</span>
                      <span className="font-semibold">{ev.player1}</span></div>
                      {ev.player2 && <span className="text-xs text-muted-foreground">({ev.player2})</span>}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose className="w-full bg-muted rounded-full p-2">Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
