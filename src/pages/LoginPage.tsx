import { useFirebase } from 'react-redux-firebase'
import StyledFirebaseAuth from '../lib/StyledFirebaseAuth'
// import { useHistory } from 'react-router-dom'; // if you use react-router

export default function LoginPage() {
    const firebase = useFirebase()

    return (
        <div className={""}>
            <StyledFirebaseAuth
                uiConfig={{
                    signInFlow: 'popup',
                    signInSuccessUrl: '/signedIn',
                    signInOptions: [
                        {
                            // @ts-ignore
                            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                            requireDisplayName: false,
                        },
                        // uncomment to enable Google Login
                        // @ts-ignore
                        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    ],
                    callbacks: {
                        signInSuccessWithAuthResult: (authResult: any, redirectUrl: any) => {
                            firebase.handleRedirectResult(authResult).then(() => {
                                // history.push(redirectUrl); if you use react router to redirect
                            });
                            return false;
                        },
                    },
                }}
                firebaseAuth={firebase.auth()}
            />
            {/* <div>
                <h2>Auth</h2>
                {
                    !isLoaded(auth)
                        ? <span>Loading...</span>
                        : isEmpty(auth)
                            ? <span>Not Authed</span>
                            : <pre>{JSON.stringify(auth, null, 2)}</pre>
                }
            </div> */}
        </div>
    )
}
