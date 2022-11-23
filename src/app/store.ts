import { Action, combineReducers, compose, createStore, ThunkAction } from '@reduxjs/toolkit';
import 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/database';
import { firebaseReducer } from 'react-redux-firebase';
import { createFirestoreInstance, firestoreReducer, FirestoreReducer, reduxFirestore } from 'redux-firestore';
import historyReducer from '../state/historyReducer';
import localReducer from '../state/localReducer';
import paneReducer from '../state/paneReducer';
import { firebaseConfig } from './firebase';
import { FirebaseSchema } from './schema';


firebase.initializeApp(firebaseConfig)
firebase.firestore()

// not sure if this compose is needed
const createStoreWithFirebase = compose(reduxFirestore(firebase))(createStore)

interface RootReducerState {
    firebase: ReturnType<typeof firebaseReducer>,
    firestore: FirestoreReducer.Reducer<FirebaseSchema>,
    local: ReturnType<typeof localReducer>,
    panes: ReturnType<typeof paneReducer>,
    history: ReturnType<typeof historyReducer>,
}

const rootReducer = combineReducers<RootReducerState>({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    local: localReducer,
    panes: paneReducer,
    history: historyReducer,
})

export const store = createStoreWithFirebase(rootReducer, 
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__({
        trace: true,
    })
)

export const reactReduxFirebaseProps = {
    firebase,
    dispatch: store.dispatch,
    createFirestoreInstance,
    config: {
        // userProfile: 'users'
        // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
    }
}

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>
