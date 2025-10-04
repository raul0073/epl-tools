'use client';

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserState } from '@/types/api/user';
import { Info } from "lucide-react";
import Link from 'next/link';
import { useMemo } from 'react';
import { computeUserStats } from '../utils/cumputeUserStats';

interface Column {
  label: string;
  tooltip?: string;
}

const columns: Column[] = [
  { label: 'P', tooltip: 'Played - Number of predictions made' },
  { label: 'B', tooltip: 'Bullseye - Number of exact predictions (3 points)' },
  { label: 'W', tooltip: 'Wins - Number of correct predictions (1 point)' },
  { label: 'PTS', tooltip: 'Total points accumulated' },
];

interface LeaderboardTableProps {
  data: UserState[];
}

export default function LeaderboardTable({ data }: LeaderboardTableProps) {
  // compute stats & sort by totalPoints descending
  const sortedData = useMemo(() => {
    return data
      .map((u) => ({ ...u, stats: computeUserStats(u) }))
      .sort((a, b) => b.stats.totalPoints - a.stats.totalPoints);
  }, [data]);

  return (
    <Table>
      <caption className="sr-only">Leaderboard Table</caption>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Team</TableHead>
          {columns.map((col) => (
            <TableHead key={col.label}>
              {col.tooltip ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <span className="flex items-center gap-1 cursor-help">
                      {col.label} <Info className="w-3 h-3 text-gray-400" />
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-[.6rem]">{col.tooltip}</PopoverContent>
                </Popover>
              ) : (
                col.label
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedData.map((u, idx) => (
          <TableRow key={u.id}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell><Link href={`/user/${u.id}`}>{u.team_name || u.name}</Link></TableCell>
            <TableCell>{u.stats.totalPredictions}</TableCell>
            <TableCell>{u.stats.exactPredictions}</TableCell>
            <TableCell>{u.stats.correctPredictions}</TableCell>
            <TableCell>{u.stats.totalPoints}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
