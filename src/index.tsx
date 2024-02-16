import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { reactReduxFirebaseProps, store } from './app/store';
import App from './app/App';
import reportWebVitals from './app/reportWebVitals';
import './index.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
    // <React.StrictMode>
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...reactReduxFirebaseProps}>
                <DndProvider backend={HTML5Backend}>
                    <App />
                </DndProvider>
            </ReactReduxFirebaseProvider>
        </Provider>
    // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
