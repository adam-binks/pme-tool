import { MantineProvider, Skeleton } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useEffect } from 'react';
import { isLoaded, useFirestore } from 'react-redux-firebase';
import { createHashRouter, RouterProvider, useParams } from "react-router-dom";
import Header from '../chrome/Header';
import Panes from '../map/Panes';
import LoginPage from '../pages/LoginPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import './App.css';
import { useAppSelector } from './hooks';

export default function App() {
    const auth = useAppSelector(state => state.firebase.auth)
    const firestore = useFirestore()

    const router = createHashRouter([
        { path: "/", element: auth ? <ProjectsPage /> : <LoginPage /> },
        { path: "/project/:projectId", element: <ProjectView /> },
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



function ProjectView() {
    const firestore = useFirestore()
    const projectId = useParams<{ projectId: string }>().projectId
    const project = useAppSelector(state => projectId && state.firestore.data.projects?.[projectId])

    useEffect(() => {
        firestore.setListener({
            collection: "projects",
            doc: projectId,
        })
    }, [projectId])

    if (!project) { return <Skeleton /> }

    return (
        <div className="App">
            <Header project={project} />
            <Panes project={project} />
        </div>
    )
}