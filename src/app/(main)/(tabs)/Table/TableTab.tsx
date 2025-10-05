'use client';

import { useEffect, useMemo, useState } from 'react'
import { TableSkeleton } from '@/components/root/loaders/TableSkeleton'
import { Button } from '@/components/ui/button'
import { TeamTable } from '@/types/api/table'
import { UserState } from '@/types/api/user'
import { getEplTable } from '../../../../../services/getEplTable'
import { getAllUsers } from '../../../../../services/getUsersTable'
import EplLeagueTable from './components/EplLeagueTable'
import LeaderboardTable from './components/LeaderboardTable'
import { buildLeagueMap, buildLeagueTabs, sortManagersByPoints } from './utils/cumputeUserStats';
import PrivateLeagueTable from './components/PrivateLeagueTable';

export default function TableTab() {
  const [users, setUsers] = useState<UserState[] | null>(null)
  const [eplTable, setEplTable] = useState<TeamTable[] | null>(null)
  const [selectedTab, setSelectedTab] = useState<string>('EPL Table')

  useEffect(() => {
    const fetch = async () => {
      const [usersData, eplData] = await Promise.all([getAllUsers(), getEplTable()])
      setUsers(usersData)
      setEplTable(eplData)
    }
    fetch()
  }, [])

  const { leagueTabs, leagueMap } = useMemo(() => {
    if (!users) return { leagueTabs: ['EPL Table', 'Leaderboard'], leagueMap: new Map() }

    const map = buildLeagueMap(users)
    const tabs = buildLeagueTabs(map)
    return { leagueTabs: tabs, leagueMap: map }
  }, [users])

  const goNext = () => {
    const currentIndex = leagueTabs.indexOf(selectedTab)
    setSelectedTab(leagueTabs[(currentIndex + 1) % leagueTabs.length])
  }

  const goPrev = () => {
    const currentIndex = leagueTabs.indexOf(selectedTab)
    setSelectedTab(leagueTabs[(currentIndex - 1 + leagueTabs.length) % leagueTabs.length])
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between gap-4 bg-gradient-to-b from-muted to-transparent p-2 rounded-md">
        <Button variant="ghost" className="rounded-full" onClick={goPrev}>&lt;</Button>
        <h2 className="text-lg font-semibold tracking-tight bg-gradient-to-bl from-indigo-600 to-teal-800 bg-clip-text text-transparent">
          {selectedTab}
        </h2>
        <Button variant="ghost" className="rounded-full" onClick={goNext}>&gt;</Button>
      </div>

      {/* EPL Table */}
      {selectedTab === 'EPL Table' && (
        eplTable ? <EplLeagueTable data={eplTable} /> : <TableSkeleton columns={4} rows={20} />
      )}

      {/* Global Leaderboard */}
      {selectedTab === 'Leaderboard' && (
        users ? <LeaderboardTable data={users} /> : <TableSkeleton columns={5} rows={10} />
      )}

      {/* Private Leagues */}
      {Array.from(leagueMap.values()).map((league, index) => {
        const tabName = `${league.name} League`
        if (selectedTab !== tabName) return null

        const standings = sortManagersByPoints(league.managers)

        return (
          <div key={`${league.league_id}-${index}`} className="border rounded-md p-2 bg-muted">
            <h3 className="font-semibold">{league.name} (Admin: {league.admin_id})</h3>
            {standings.length
              ? <PrivateLeagueTable data={standings} />
              : <TableSkeleton columns={5} rows={8} />
            }
          </div>
        )
      })}
    </div>
  )
}
