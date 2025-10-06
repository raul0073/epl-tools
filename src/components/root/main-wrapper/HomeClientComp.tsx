'use client';

import { PredictionTab } from "@/app/(main)/(tabs)/Predictions/PredictionsTab";
import TableTab from "@/app/(main)/(tabs)/Table/TableTab";
import { FixturesTable } from "@/components/root/tables/FixturesTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRelativeTime } from "@/lib/utils";
import { Fixture } from "@/types/api/fixtures";
import { useEffect, useState } from "react";
import { fetchFixtures } from "../../../../services/fetchFixtures";
import { navigateRound, tabTriggerClass } from "./homeTabs";
import FantasyTab from "@/app/(main)/(tabs)/Fantasy/FantasyTab";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { updateRound } from "@/lib/slices/meta";

export default function HomeClientComp() {
  const round = useSelector((state: RootState)=> state.meta.currentRound)
  const dispatch = useDispatch()
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state: RootState)=>state.currentUser)
  // Fetch fixtures
  useEffect(() => {
    setLoading(true);
    fetchFixtures(round)
      .then((data) => {
        if (data?.meta) {
          if (round === null) dispatch(updateRound(data.fixtures[0].week));
          setFixtures(data.fixtures);
          setLastUpdated(data.meta.last_updated);
        } else {
          setFixtures([]);
        }
      })
      .finally(() => setLoading(false));
  }, [round]);

  return (
    <section className="tabs w-full">
      <Tabs defaultValue="fixtures" className="w-full border gap-0">
        <TabsList className="w-full rounded-none">
          <TabsTrigger value="fixtures" className={tabTriggerClass}>Fixtures</TabsTrigger>
          <TabsTrigger value="predictions" className={tabTriggerClass}>Predictions</TabsTrigger>
          <TabsTrigger value="table" className={tabTriggerClass}>Table</TabsTrigger>
          <TabsTrigger value="fantasy" className={tabTriggerClass} disabled={currentUser.fantasy_team_id === null}>Fantasy</TabsTrigger>
        </TabsList>

        {/* Fixtures Tab */}
        <TabsContent value="fixtures">
          <div className="space-y-2">
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-4 bg-gradient-to-b from-muted to-transparent p-2 rounded-md">
                <Button
                  variant="ghost"
                  onClick={() => dispatch(updateRound(navigateRound.prev(round)))}
                  disabled={!round || round <= 1}
                  className="rounded-full"
                >&lt;</Button>
                <h2 className="text-lg font-semibold">GW {round ?? "-"}</h2>
                <Button
                  variant="ghost"
                  onClick={() => dispatch(updateRound(navigateRound.next(round)))}
                  disabled={!round}
                  className="rounded-full"
                >&gt;</Button>
              </div>
              <p className="text-muted-foreground text-xs text-center w-full">
                Last update: <strong>{lastUpdated && getRelativeTime(lastUpdated)}</strong>
              </p>
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading fixtures...</p>
            ) : (
              <FixturesTable fixtures={fixtures} />
            )}
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions">
          {round === null ? (
            <p className="text-sm text-muted-foreground">Loading predictions...</p>
          ) : (
            <PredictionTab fixtures={fixtures} round={round} />
          )}
        </TabsContent>

        {/* Table Tab */}
        <TabsContent value="table">
          <TableTab />
        </TabsContent>
        {/* Table Tab */}
        <TabsContent value="fantasy">
          <FantasyTab />
        </TabsContent>
      </Tabs>
    </section>
  );
}
