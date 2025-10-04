import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { UserState } from '@/types/api/user';

function UserProfileHeaderPublic({ user }: { user: UserState }) {

    return (
        <Card className='border-none shadow-none p-0 gap-0'>
            <CardHeader className='flex justify-between items-center p-2'>
                <div className='flex flex-col items-start'>
                    <CardTitle className='text-lg'>    {user.team_name ?? user.name}</CardTitle>
                    <CardDescription className='pt-1'>
                        {user.team_name && (
                            <span>{user.name}</span>
                        )}
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>
    )
}

export default UserProfileHeaderPublic

