import { MantineProvider, Skeleton } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import Header from '../chrome/Header';
import Panes from '../map/Panes';
import LoginPage from '../pages/LoginPage';
import './App.css';
import { useAppSelector } from './hooks';

export default function App() {
    const auth = useAppSelector(state => state.firebase.auth)

    if (!isLoaded(auth)) return <Skeleton />

    return (
        <MantineProvider>
            <NotificationsProvider>
                <div>
                    {isEmpty(auth) ?
                        <LoginPage />
                        :
                        <div className="App">
                            <Header />
                            <Panes />
                        </div>
                    }
                </div>
            </NotificationsProvider>
        </MantineProvider>
    )
}