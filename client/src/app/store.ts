import { ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { CrossTabClient, IndexedStore, badge, badgeEn, log, confirm } from '@logux/client';
import { badgeStyles } from '@logux/client/badge/styles';
import { createStoreCreator } from '@logux/redux';

// export const store = configureStore({
//     reducer: {

//     },
// })

const reducer = combineReducers({
    // TODO: Add reducers
    test: (state = 0) => state // Remove me when you will have real reducer
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

export const store = createStore(reducer)

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
