import { ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { CrossTabClient, IndexedStore, badge, badgeEn, log, confirm } from '@logux/client';
import { badgeStyles } from '@logux/client/badge/styles';
import { createStoreCreator } from '@logux/redux';
import { mapReducer } from '../reducers/mapSlice';
import { panesReducer } from '../reducers/paneSlice';


const reducer = combineReducers({
    maps: mapReducer,
    panes: panesReducer,
})

const client = new CrossTabClient({
    server: process.env.NODE_ENV === 'development'
        ? 'ws://localhost:31337'
        : 'wss://logux.example.com',
    // store: new IndexedStore(),  // TODO: add indexedstore when it's more stable
    subprotocol: '1.0.0',
    userId: 'anonymous',  // TODO: We will fill it in Authentication recipe
    token: ''  // TODO: We will fill it in Authentication recipe
})

const createStore = createStoreCreator(client)

export const store = createStore(reducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__())

badge(store.client, { messages: badgeEn, styles: badgeStyles })
log(store.client)
confirm(store.client)
store.client.start()

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>
