import { useFirebase } from 'react-redux-firebase';
import StyledFirebaseAuth from '../lib/StyledFirebaseAuth';
import './LoginPage.css';
// import { useHistory } from 'react-router-dom'; // if you use react-router

export default function LoginPage() {
    const firebase = useFirebase()

    return (
        <div className={"max-w-prose m-auto"}>
            <p className='font-semibold text-center pb-2'>Enter your email address to sign in or sign up</p>
            <StyledFirebaseAuth
                uiConfig={{
                    siteName: 'Schematica',
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

            <p className='max-w-prose text-center text-gray-500 text-xs mt-2'>
                Your data is stored using Google Firebase, in servers located in the EU.<br/>

                See the <a className='text-darkplatinum' href="https://firebase.google.com/support/privacy">Firebase privacy policy</a> for more information.
            </p>
        </div>
    )
}
