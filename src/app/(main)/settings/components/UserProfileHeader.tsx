import { Label } from '@/components/ui/label';
import { UserState } from '@/types/api/user';
import TeamNameEditor from './form/UserTeamNameEditor';

function UserProfileHeader({ user }: { user: UserState }) {

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
            <TeamNameEditor />
        </div>
    )
}

export default UserProfileHeader

