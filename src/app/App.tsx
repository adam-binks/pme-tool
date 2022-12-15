import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useEffect } from 'react';
import { useFirestore } from 'react-redux-firebase';
import Panes from '../map/Panes';
import './App.css';
import Header from './Header';

export default function App() {
    return (
        <MantineProvider>
            <NotificationsProvider>
                <div>
                    <div className="App">
                        <Header />
                        <Panes />
                    </div>
                </div>
            </NotificationsProvider>
        </MantineProvider>
    )
}