import './App.css';
import Panes from '../map/Panes';
import Header from './Header';
import { MantineProvider } from '@mantine/core';

export default function App() {
    return (
        <MantineProvider>
            <div className="App">
                <Header />
                <Panes />
            </div>
        </MantineProvider>
    )
}