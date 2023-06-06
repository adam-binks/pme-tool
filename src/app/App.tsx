import { MantineProvider, Skeleton } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useEffect } from 'react';
import { isEmpty, isLoaded, useFirestore } from 'react-redux-firebase';
import { createHashRouter, RouterProvider } from "react-router-dom";
import LoginPage from '../pages/LoginPage';
import { ProjectView } from '../pages/ProjectView';
import './App.css';
import { useAppSelector } from './hooks';

// add custom colors to theme
import { DefaultMantineColor, Tuple } from '@mantine/core';
import { getReplaySuffix } from '../etc/actionLogging';
import { LandingPage } from '../pages/LandingPage';
type ExtendedCustomColors = 'mistyrose' | DefaultMantineColor;
declare module '@mantine/core' {
    export interface MantineThemeColorsOverride {
        colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
    }
}

export const APP_FONT = "Ubuntu"

export default function App() {
    const auth = useAppSelector(state => state.firebase.auth)
    const firestore = useFirestore()

    const router = createHashRouter([
        { path: "/", element: <LandingPage /> },
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
        <MantineProvider theme={{
            white: "#fef5f4",
            primaryColor: "mistyrose",
            fontFamily: APP_FONT,
            headings: {
                fontFamily: APP_FONT,
            },
            colors: {
                mistyrose: ['#fff0e1', '#fff0e1', '#fff0e1', '#fff0e1', '#fed6b3', '#fdba83', '#fba052', '#fb8424', '#e16c0e', '#af5309'],
            }
        }}>
            <NotificationsProvider>
                <RouterProvider router={router} />
            </NotificationsProvider>
        </MantineProvider>
    )
}