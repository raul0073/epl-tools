'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RootState } from '@/lib/store'
import { FantasyTeamResponse } from '@/types/api/fantasy'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { getFantasyTeamData } from '../../../../../services/fantasy/getTeamMeta'
import Loading from '../../loading'
import FantasyFormationTab from './components/FantasyFormation'
import ErrorComp from '@/components/root/error/ErrorComp'

export default function FantasyTab() {
    const userFantasyTeamId = useSelector((state: RootState) => state.currentUser.fantasy_team_id)
   
    const [teamData, setTeamData] = useState<FantasyTeamResponse['data'] | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!userFantasyTeamId) {
            toast.error("No Fantasy team id was found.", {
                action: (
                    <Button variant="ghost" className="justify-self-end">
                        <Link href="/settings">Go to Settings</Link>
                    </Button>
                )
            })
            return
        }

        setLoading(true)
        getFantasyTeamData(userFantasyTeamId)
            .then((res: FantasyTeamResponse) => setTeamData(res.data))
            .catch((err) => {
                console.error(err)
                toast.error("Failed to load Fantasy team data.")
            })
            .finally(() => setLoading(false))
    }, [userFantasyTeamId])

     if(!userFantasyTeamId) return <ErrorComp reason="no fantasy team id" />

    if (loading) return <Loading />

    if (!teamData) return <div>No data available</div>

    return (
        <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="w-full flex items-center justify-center gap-4 bg-gradient-to-b from-muted to-transparent p-2 rounded-md text-center">
                <h2 className="text-xl font-semibold tracking-tight bg-gradient-to-bl from-indigo-600 to-teal-800 bg-clip-text text-transparent">
                    {teamData.name}
                </h2>
            </div>
            <Card className='border-none shadow-none'>

                <CardContent className='flex flex-col items-center gap-2 px-1'>
                    <p>Gameweek {teamData.current_event}</p>
                    <div className='p-6 rounded shadow-lg  bg-lime-400 flex flex-col items-center w-2/3 mx-auto'>
                        <strong className='text-3xl'>{teamData.summary_event_points}</strong><br />Points
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 w-full'>
                        <span className='flex flex-col justify-center rounded shadow-md p-2 items-center text-center gap-1 border-input/60 bg-muted w-full'>
                            <span className='text-muted-foreground text-nowrap'>GW Rank</span>
                            <strong>{new Intl.NumberFormat("he-IL").format(teamData.summary_event_rank)}</strong>
                        </span>
                        <span className='flex flex-col justify-center rounded shadow-md p-2 items-center text-center gap-1 border-input/60 bg-muted w-full'>
                            <span className='text-muted-foreground text-nowrap'>Total Points</span>
                            <strong>{new Intl.NumberFormat("he-IL").format(teamData.summary_overall_points)}</strong>
                        </span>
                        <span className='flex flex-col justify-center rounded shadow-md p-2 items-center text-center gap-1 border-input/60 bg-muted w-full'>
                            <span className='text-muted-foreground text-nowrap'>Overall Rank</span>
                            <strong>{new Intl.NumberFormat("he-IL").format(teamData.summary_overall_rank)}</strong>
                        </span>

                    </div>
                </CardContent>
            </Card>
            <FantasyFormationTab />
            <Separator />
            <Card className='border-none shadow-none'>
                <CardHeader>
                    <CardTitle>Leagues</CardTitle>
                    <CardDescription>Classic Leagues & H2H</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {teamData.leagues.classic.map((league) => (
                        <div key={league.id} className="flex justify-between border-b last:border-b-0">
                            <span>{league.name}</span>
                            <span>#{new Intl.NumberFormat("he-IL").format(league.entry_rank)}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
