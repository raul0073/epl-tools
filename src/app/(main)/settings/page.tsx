import React from 'react'
import AuthLoaderPage from '../auth/signin/utils/AuthLoader'
import ProfilePage from './components/ProfilePageClientComp'

function Page() {
    return (
        <AuthLoaderPage>
            <ProfilePage />
        </AuthLoaderPage>

    )
}

export default Page
