import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
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