import React from 'react'
import { getUserById } from '../../../../../services/getUser'
import UserProfileWrapper from './components/UserProfileClientPage'
import AuthLoaderPage from '../../auth/signin/utils/AuthLoader'
export type PageProps = { params: Promise<{ userId: string }> }

async function Page({ params }: PageProps ){
    const {userId} = await params
    const user = await getUserById(encodeURIComponent(userId))
    
  return (
    <section className='user-profile-page w-full h-full'>
        <AuthLoaderPage>

      <UserProfileWrapper viewedUser={user} />
        </AuthLoaderPage>
    </section>
  )
}

export default Page
