import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Navigate, Outlet } from 'react-router';

function ProtectedRouteLayout() {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    if (!isSignedIn) {
        return <Navigate to='/sign-in' />
    }
    return <Outlet />
}

export default ProtectedRouteLayout