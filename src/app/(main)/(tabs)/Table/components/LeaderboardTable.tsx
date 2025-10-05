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
  accessor: keyof ReturnType<typeof computeUserStats>;
}

const columns: Column[] = [
  { label: 'P', tooltip: 'Played - Number of predictions made', accessor: 'totalPredictions' },
  { label: 'B', tooltip: 'Bullseye - Number of exact predictions (3 points)', accessor: 'exactPredictions' },
  { label: 'W', tooltip: 'Wins - Number of correct predictions (1 point)', accessor: 'correctPredictions' },
  { label: 'PTS', tooltip: 'Total points accumulated', accessor: 'totalPoints' },
];

// Optional small component to render table header with tooltip
function ColumnHeader({ column }: { column: Column }) {
  if (!column.tooltip) return <>{column.label}</>

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="flex items-center gap-1 cursor-help">
          {column.label} <Info className="w-3 h-3 text-gray-400" />
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-fit text-[.6rem]">{column.tooltip}</PopoverContent>
    </Popover>
  )
}

interface LeaderboardTableProps {
  data: UserState[];
}

export default function LeaderboardTable({ data }: LeaderboardTableProps) {
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
              <ColumnHeader column={col} />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedData.map((u, idx) => (
          <TableRow key={u.id || `${u.name}-${idx}`}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>
              <Link href={`/user/${u.id}`}>{u.team_name || u.name || '—'}</Link>
            </TableCell>
            {columns.map(col => (
              <TableCell key={col.accessor}>{u.stats[col.accessor]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
