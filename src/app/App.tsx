import { MantineProvider, Skeleton } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useEffect } from 'react';
import { isEmpty, isLoaded, useFirestore } from 'react-redux-firebase';
import { createHashRouter, RouterProvider } from "react-router-dom";
import LoginPage from '../pages/LoginPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectView } from '../pages/ProjectView';
import './App.css';
import { useAppSelector } from './hooks';

export default function App() {
    const auth = useAppSelector(state => state.firebase.auth)
    const firestore = useFirestore()

    const router = createHashRouter([
        { path: "/", element: !isEmpty(auth) ? <ProjectsPage /> : <LoginPage /> },
        { path: "/project/:projectId", element: !isEmpty(auth) ? <ProjectView /> : <LoginPage /> },
    ])

    useEffect(() => {
        if (!auth?.uid) { return }

        firestore.setListener({
            collection: "projects",
            where: ["editors", "array-contains", auth.uid]
        })
    }, [auth.uid])


    if (!isLoaded(auth)) { return <Skeleton /> }

    return (
        <MantineProvider>
            <NotificationsProvider>
                <RouterProvider router={router} />
            </NotificationsProvider>
        </MantineProvider>
    )
}