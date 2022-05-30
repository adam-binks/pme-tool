import './App.css';
import Panes from '../map/Panes';
import Header from './Header';

export default function App() {
    return (
        <div className="App">
            <Header/>
            <Panes />
        </div>
    )
}