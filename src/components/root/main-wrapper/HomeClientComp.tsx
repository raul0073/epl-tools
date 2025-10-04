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

const tabTriggerClass = [
  "relative group w-full rounded-none py-4 shadow-none border-x-0 border-t-0",
  "text-sm font-medium",
  "transition-colors duration-200 ease-in-out",
  "bg-gradient-to-b from-muted to-transparent",
  "data-[state=active]:border-t-0",
  "data-[state=active]:border-x-0",
  "data-[state=active]:border-b-2",
  "data-[state=active]:border-indigo-600",
  "outline-none flex items-center justify-center",
].join(" ");

function HomeClientComp() {
  const [round, setRound] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchFixtures(round).then((data) => {
      if (data?.meta) {
        // set current round if unknown
        if (round === null) setRound(data.fixtures[0].week);
        setFixtures(data.fixtures);
        setLastUpdated(data.meta.last_updated)
      } else {
        setFixtures([]);
      }
      setLoading(false);
    });
  }, [round]);

  const prevRound = () => round && setRound((r) => (r ? Math.max(1, r - 1) : 1));
  const nextRound = () => round && setRound((r) => (r ? r + 1 : 1));

  return (
    <section className="tabs w-full">

      <Tabs defaultValue="fixtures" className="w-full border gap-0">
        <TabsList className="w-full rounded-none">
          <TabsTrigger value="fixtures" className={tabTriggerClass}>Fixtures</TabsTrigger>
          <TabsTrigger value="predictions" className={tabTriggerClass}>Predictions</TabsTrigger>
          <TabsTrigger value="table" className={tabTriggerClass}>Table</TabsTrigger>
        </TabsList>

        <TabsContent value="fixtures">

          <section className="fixtures space-y-2">
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-4 bg-gradient-to-b from-muted to-transparent p-2 rounded-md">
                <Button variant="ghost" onClick={prevRound} disabled={!round || round <= 1} className="rounded-full">&lt;</Button>
                <h2 className="text-lg font-semibold">GW {round ?? "-"}</h2>
                <Button variant="ghost" onClick={nextRound} disabled={!round} className="rounded-full">&gt;</Button>
              </div>
              <p className="text-muted-foreground text-xs text-center w-full"> {`Last update:`} <strong>{`${lastUpdated && getRelativeTime(lastUpdated)}`}</strong></p>
            </div>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading fixtures...</p>
            ) : (
              <FixturesTable fixtures={fixtures} />
            )}
          </section>
        </TabsContent>

        <TabsContent value="predictions">
          {round === null ? (
            <p className="text-sm text-muted-foreground">Loading predictions...</p>
          ) : (
            <PredictionTab fixtures={fixtures} round={round} setRound={setRound} />
          )}
        </TabsContent>

        <TabsContent value="table">
          <TableTab />
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default HomeClientComp;
