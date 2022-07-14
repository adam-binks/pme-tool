import { ThunkAction, Action, combineReducers, compose, createStore } from '@reduxjs/toolkit';
import paneReducer from '../reducers/paneReducer';
import firebase from 'firebase/compat/app'
import 'firebase/auth';
import 'firebase/database';
import 'firebase/compat/firestore';
import { firestoreReducer, reduxFirestore, createFirestoreInstance } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase';

const firebaseConfig = {
    apiKey: "AIzaSyB12r9VgxPIQLLauHll-J_MqTPPVuPzYGE",
    authDomain: "pme-tool.firebaseapp.com",
    projectId: "pme-tool",
    storageBucket: "pme-tool.appspot.com",
    messagingSenderId: "647602178300",
    appId: "1:647602178300:web:aae9b56eaa4147e0b3af79"
}

firebase.initializeApp(firebaseConfig)
firebase.firestore()

// const createStoreWithFirebase = compose(reduxFirestore(firebase))(createStore)

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    panes: paneReducer,
})

export const store = createStore(rootReducer, 
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
