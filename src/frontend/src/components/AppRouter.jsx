import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite';

import { adminRoutes, publicRoutes, userRoutes } from '../routes.js';
import { HOME_ROUTE, AUTH_ROUTE } from '#utils/constants';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { useAuth } from "#hooks/useAuth.jsx";

const AppRouter = observer (() => {
    const {user} = useAuth()

    if (!user) {
        return (
            <Routes>
                { publicRoutes.map(({path, Component}) => 
                    <Route key={path} path={path} element={<Component/>} exact/>
                )}
                <Route path="*" element={<Navigate to={AUTH_ROUTE}/>}/>
            </Routes>
        )
    }

    if (user.role !== 'ADMIN') {
        return (
            <Routes>
                { userRoutes.map(({path, Component}) => 
                    <Route key={path} path={path} element={<Component/>} exact/>
                )}
                <Route path="*" element={<Navigate to={HOME_ROUTE}/>}/> 
            </Routes>
        )
    }

    return (
            <Routes>
                { adminRoutes.map(({path, Component}) => 
                    <Route key={path} path={path} element={
                        <ProtectedRoute>
                            <Component/>
                        </ProtectedRoute>
                        
                    } exact/>
                )}
                <Route path="*" element={
                    <ProtectedRoute>
                        <Navigate to={HOME_ROUTE}/>
                    </ProtectedRoute>
                    } /> 
            </Routes>
    )
})

export default AppRouter;