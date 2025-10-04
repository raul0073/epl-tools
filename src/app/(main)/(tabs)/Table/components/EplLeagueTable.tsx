'use client';

import React from 'react';
import { TeamTable } from '@/types/api/table';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import Image from 'next/image';
import { EPL_TEAM_ALIAS, EPL_TEAM_LOGO_MAP } from '@/types/local/teamsIconsMapping';

type Props = {
  data: TeamTable[];
};

export default function EplLeagueTable({ data }: Props) {
  return (
    <div className="overflow-x-auto ">
      <Table className='text-xs sm:text-sm'>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>MP</TableHead>
            <TableHead>W</TableHead>
            <TableHead>D</TableHead>
            <TableHead>L</TableHead>
            <TableHead className="hidden sm:table-cell">GF</TableHead>
            <TableHead className="hidden sm:table-cell">GA</TableHead>
            <TableHead>GD</TableHead>
            <TableHead>PTS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((team, idx) => (
            <TableRow key={team.team} className="">
              <TableCell>{idx + 1}</TableCell>
              <TableCell className="font-semibold">
                <Image
                  src={`/logos/epl/${team.team}.png`}
                  alt={team.team}
                  width={16}
                  height={16}
                  className="inline mx-0.5"
                />{' '}
                {EPL_TEAM_ALIAS[team.team]}
              </TableCell>
              <TableCell>{team.MP}</TableCell>
              <TableCell>{team.W}</TableCell>
              <TableCell>{team.D}</TableCell>
              <TableCell>{team.L}</TableCell>
              <TableCell className="hidden sm:table-cell">{team.GF}</TableCell>
              <TableCell className="hidden sm:table-cell">{team.GA}</TableCell>
              <TableCell>{team.GD}</TableCell>
              <TableCell className="font-bold">{team.Pts}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
