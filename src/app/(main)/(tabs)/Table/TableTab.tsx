// keep existing imports...
import { TableSkeleton } from '@/components/root/loaders/TableSkeleton'
import { Button } from '@/components/ui/button'
import { TeamTable } from '@/types/api/table'
import { PrivateLeagueManager, UserState } from '@/types/api/user'
import { useEffect, useMemo, useState } from 'react'
import { getEplTable } from '../../../../../services/getEplTable'
import { getAllUsers } from '../../../../../services/getUsersTable'
import EplLeagueTable from './components/EplLeagueTable'
import LeaderboardTable from './components/LeaderboardTable'

export default function TableTab() {
  const [users, setUsers] = useState<UserState[] | null>(null)
  const [eplTable, setEplTable] = useState<TeamTable[] | null>(null)
  const [selectedTab, setSelectedTab] = useState<string>('EPL Table')

  useEffect(() => {
    const fetch = async () => {
      const usersData = await getAllUsers()
      const eplData = await getEplTable()
      setUsers(usersData)
      setEplTable(eplData)
    }
    fetch()
  }, [])

  /**
   * Build a map of private leagues across all users.
   * leagueKey -> {
   *   league_id,
   *   name,
   *   admin_id,
   *   rules,
   *   managers: [{ user_id, team_name, points: { total_points, last_round_points } }]
   * }
   *
   * This normalizes leagues and will be used to render tabs and standings.
   */
  const { leagueTabs, leagueMap } = useMemo(() => {
    const tabs = ['EPL Table', 'Leaderboard']
    //eslint-disable-next-line
    const map = new Map<string, any>() // league_id -> league object

    if (!users) return { leagueTabs: tabs, leagueMap: map }

    users.forEach(user => {
      (user.private_leagues ?? []).forEach(l => {
        const id = l.name ?? `${l.name}-${l.admin_id ?? 'unknown'}`
        // create normalized league entry if not exists
        if (!map.has(id)) {
          map.set(id, {
            league_id: id,
            name: l.name,
            admin_id: l.admin_id,
            rules: l.rules ?? {},
            managers: [] as { user_id: string; team_name: string; points: number }[],
          })
        }
        const entry = map.get(id)
        // try to get points snapshot from league manager object, otherwise fallback to user.points.total_points
        const managerSnapshot = (l.managers ?? []).find((m: PrivateLeagueManager) => m.user_id === user.id)
        const pointsNumber = managerSnapshot
          ? (managerSnapshot.points?.total_points ?? 0)
          : (user.points?.total_points ?? 0)

        entry.managers.push({
          user_id: user.id ?? '',
          team_name: user.team_name ?? user.name ?? '—',
          points: pointsNumber,
        })
      })
    })

    // build tab names (unique)
    for (const entry of Array.from(map.values())) {
      const tabName = `${entry.name} League`
      if (!tabs.includes(tabName)) tabs.push(tabName)
    }

    return { leagueTabs: tabs, leagueMap: map }
  }, [users])

  // tab navigation helpers unchanged...
  const goNext = () => {
    const currentIndex = leagueTabs.indexOf(selectedTab)
    const nextIndex = (currentIndex + 1) % leagueTabs.length
    setSelectedTab(leagueTabs[nextIndex])
  }

  const goPrev = () => {
    const currentIndex = leagueTabs.indexOf(selectedTab)
    const prevIndex = (currentIndex - 1 + leagueTabs.length) % leagueTabs.length
    setSelectedTab(leagueTabs[prevIndex])
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation unchanged */}
      <div className="flex items-center justify-between gap-4 bg-gradient-to-b from-muted to-transparent p-2 rounded-md">
        <Button variant="ghost" className="rounded-full" onClick={goPrev}>&lt;</Button>
        <h2 className="text-lg font-semibold tracking-tight bg-gradient-to-bl from-indigo-600 to-teal-800 bg-clip-text text-transparent">{selectedTab}</h2>
        <Button variant="ghost" className="rounded-full" onClick={goNext}>&gt;</Button>
      </div>

      {/* EPL and Leaderboard unchanged */}
      {selectedTab === 'EPL Table' && (
        eplTable ? (
          <EplLeagueTable data={eplTable} />
        ) : (
          <TableSkeleton columns={4} rows={20} />
        )
      )}

      {selectedTab === 'Leaderboard' && (
        users ? (
          <LeaderboardTable data={users} />
        ) : (
          <TableSkeleton columns={5} rows={10} />
        )
      )}

      {/* Render private league tabs by name -> use leagueMap */}
      {Array.from(leagueMap.values()).map((league) => {
        const tabName = `${league.name} League`
        if (selectedTab !== tabName) return null

        // sort managers by points desc
        const standings = (league.managers ?? []).slice().sort((a: PrivateLeagueManager, b: PrivateLeagueManager) => b.points.total_points - a.points.total_points)

        return (
          <div key={league.league_id} className="border rounded-md p-2 bg-muted">
            <h3 className="font-semibold">{league.name} (Admin: {league.admin_id})</h3>

            {standings.length ? (
              // LeaderboardTable expects items in a certain shape. Ensure it matches
              <LeaderboardTable data={standings} />
            ) : (
              <TableSkeleton columns={5} rows={8} />
            )}
          </div>
        )
      })}
    </div>
  )
}
