import './App.css';
import Panes from '../map/Panes';
import Header from './Header';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

export default function App() {
    return (
        <MantineProvider>
            <NotificationsProvider>
                <div className="App">
                    <Header />
                    <Panes />
                </div>
            </NotificationsProvider>
        </MantineProvider>
    )
}