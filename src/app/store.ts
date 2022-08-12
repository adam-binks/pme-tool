import { ThunkAction, Action, combineReducers, compose, createStore } from '@reduxjs/toolkit';
import paneReducer from '../reducers/paneReducer';
import firebase from 'firebase/compat/app'
import 'firebase/auth';
import 'firebase/database';
import 'firebase/compat/firestore';
import { firestoreReducer, reduxFirestore, createFirestoreInstance, FirestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase';
import { firebaseConfig } from './firebase';
import { FirebaseSchema } from './schema';


firebase.initializeApp(firebaseConfig)
firebase.firestore()

// not sure if this compose is needed
const createStoreWithFirebase = compose(reduxFirestore(firebase))(createStore)

interface RootReducerState {
    firebase: ReturnType<typeof firebaseReducer>,
    firestore: FirestoreReducer.Reducer<FirebaseSchema>,
    panes: ReturnType<typeof paneReducer>
}

const rootReducer = combineReducers<RootReducerState>({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    panes: paneReducer,
})

export const store = createStoreWithFirebase(rootReducer, 
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
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
