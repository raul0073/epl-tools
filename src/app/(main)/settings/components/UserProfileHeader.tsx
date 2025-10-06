import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { setUser } from '@/lib/slices/user';
import { UserState } from '@/types/api/user';
import { useDispatch } from 'react-redux';
import TeamNameEditor from './form/UserTeamNameEditor';

function UserProfileHeader({ user }: { user: UserState }) {
    const dispatch = useDispatch()
    function updateStoreWithFantasyTeamID(teamID: number) {
        dispatch(setUser({ fantasy_team_id: teamID }))
    }
    return (
        <div className="flex flex-col gap-4">


            <div className='flex items-start flex-col'>
                <Label>
                    Name
                </Label>
                <p className='text-muted-foreground'>{user.name}</p>

            </div>
            <div className='flex items-start flex-col'>
                <Label>
                    Email
                </Label>
                <p className='text-muted-foreground'>{user.email}</p>

            </div>
            <Separator />
            <div className='flex items-start flex-col'>
                <Label>
                    Fantasy Team ID
                </Label>
                <Input type='number' onChange={(e) => updateStoreWithFantasyTeamID(Number(e.target.value))} placeholder='104xxxx' defaultValue={user.fantasy_team_id || ""} className="pt-2 w-full rounded border-b-2 border-t-none border-x-none outline-none shadow-none" />

            </div>
            <TeamNameEditor />
        </div>
    )
}

export default UserProfileHeader

