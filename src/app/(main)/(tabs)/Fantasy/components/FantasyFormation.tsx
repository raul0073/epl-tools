'use client'

import FormationSkeleton from '@/components/root/loaders/FormationSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { RootState } from '@/lib/store'
import { FantasyPick, FantasyTeamPicksData } from '@/types/api/fantasy_player'
import { EPL_TEAM_FANTASY_NAMES } from '@/types/local/teamsIconsMapping'
import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { getTeamSquadByGameweek } from '../../../../../../services/fantasy/getTeamSquadBtGW'

export default function FantasyFormationTab() {
    const userFantasyTeamId = useSelector((state: RootState) => state.currentUser.fantasy_team_id)
    const round = useSelector((state: RootState) => state.meta.currentRound)
    const [teamData, setTeamData] = useState<FantasyTeamPicksData | null>(null)
    const [loading, setLoading] = useState(false)

    const getData = async () => {
        try {
            if (!userFantasyTeamId || !round) return toast.error('No team or round selected')
            const res = await getTeamSquadByGameweek(userFantasyTeamId, round)
            if (res?.success) setTeamData(res.data)
        } catch (error) {
            console.error(error)
            toast.error('Failed to fetch team data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!userFantasyTeamId) return
        setLoading(true)
        if (round !== null) getData()
    }, [userFantasyTeamId, round])

    if (!userFantasyTeamId) return <div>No Fantasy Team Detected</div>
    if (loading) return <FormationSkeleton />
    if (!teamData) return <div>No data available</div>

    // Split starting 11 vs substitutes
    const starting11 = teamData.picks.slice(0, 11)
    const substitutes = teamData.picks.slice(11)

    // Group starting 11 by position
    const positions: Record<string, FantasyPick[]> = {
        GKP: starting11.filter(p => p.player.position === 'GKP'),
        DEF: starting11.filter(p => p.player.position === 'DEF'),
        MID: starting11.filter(p => p.player.position === 'MID'),
        FWD: starting11.filter(p => p.player.position === 'FWD'),
    }

    // Generate positions for each type based on count
    const getPositions = (type: keyof typeof positions) => {
        const count = positions[type].length
        if (count === 0) return []
        const rows: { top: string; left: string }[] = []

        if (type === 'GKP') return [{ top: '89%', left: '50%' }]

        const topMap: Record<typeof type, string> = { DEF: '69%', MID: '45%', FWD: '15%', GKP: '95%' }
        const spacing = 100 / (count + 1)

        for (let i = 0; i < count; i++) {
            rows.push({
                top: topMap[type],
                left: `${spacing * (i + 1)}%`,
            })
        }
        return rows
    }



    const renderPlayer = (pick: FantasyPick, idx: number, posArr: { top: string; left: string }[]) => {
        const pos = posArr[idx]
        if (!pos) return null

        return (
            <Fragment key={pick.element}>
                <div
                    style={{
                        position: 'absolute',
                        top: pos.top,
                        left: pos.left,
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        zIndex: 2,
                    }}
                >
                    {/* Circle with Team Logo */}
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            border: '1px solid #333',
                            backgroundColor: pick.is_captain
                                ? 'yellow'
                                : pick.is_vice_captain
                                    ? 'orange'
                                    : 'white',
                            backgroundImage: `url("/logos/epl/${encodeURIComponent(
                                EPL_TEAM_FANTASY_NAMES[pick.player.team]
                            )}.png")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            overflow: 'hidden',
                            margin: '0 auto',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        }}
                    />

                    {/* Text below circle */}
                    <strong className='text-background font-bold text-xs sm:text-sm'>{pick.player.web_name}</strong>

                    <div className='bg-white rounded-t-sm' >
                        <strong className='w-full text-xs sm:text-sm'>{pick.player.event_points} pts</strong>
                        <div className='w-full border-t-2 bg-black'>

                            <div className='text-muted text-xs'>{pick.player.selected_by_percent}%</div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }

    return (
        <div className="space-y-4">
            <Card className='border-none shadow-none'>

                {/* Pitch with starting 11 */}
                <CardContent
                    className='p-0'
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '600px',
                        aspectRatio: '2/3',
                        margin: '0 auto',
                        backgroundImage: "url('/textures/pitch.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                    }}
                >
                    {(['GKP', 'DEF', 'MID', 'FWD'] as const).map(type =>
                        positions[type].map((p, i) => renderPlayer(p, i, getPositions(type)))
                    )}
                </CardContent>

                {/* Substitutes */}
                {substitutes.length > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 12,
                            flexWrap: 'wrap',
                            padding: '12px 0',
                        }}
                        className='w-2/3 border bg-muted rounded  mx-auto px-4 py-2'
                    >
                        {substitutes.map(sub => (
                            <div
                                key={sub.element}
                                style={{
                                    width: 50,
                                    height: 50,
                                    textAlign: 'center',
                                    borderRadius: '50%',
                                    backgroundColor: sub.is_captain ? 'yellow' : sub.is_vice_captain ? 'orange' : 'white',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                                    fontSize: 9,
                                }}
                            >
                                <strong>{sub.player.web_name}</strong>
                                <span>{sub.player.event_points} pts</span>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}
