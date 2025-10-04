'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';
import UserProfileHeader from './UserProfileHeader';
import AvatarPicker from './form/UserAvatarEditor';
import SeasonPredictionEditor from './form/UserPredictionsSeason';


export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.currentUser);

  return (
    <div className="p-4 max-w-4xl mx-auto flex flex-col gap-4 mt-4">
      <Card className='border-none shadow-none p-0'>
        <CardHeader className='flex justify-between items-center p-2'>
          <div className='flex flex-col items-start'>
            <CardTitle>User Info</CardTitle>
            <CardDescription className='pt-1'>
              Set your profile picture and team name
            </CardDescription>
          </div>
          <span><AvatarPicker /></span>
        </CardHeader>
        <CardContent className='p-2'>
          <UserProfileHeader user={user} />
        </CardContent>
      </Card>


      <Separator />
      <Card className='border-none shadow-none p-0'>
        <CardHeader className='p-2'>
          <CardTitle>Season Predictions</CardTitle>
          <CardDescription>League Champion, Top Scorer & Assist King</CardDescription>
        </CardHeader>
        <CardContent className='p-2'>
          <SeasonPredictionEditor />
        </CardContent>
      </Card>


    </div>
  );
}
