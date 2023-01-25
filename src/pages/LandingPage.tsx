import { isEmpty } from "react-redux-firebase"
import { useAppSelector } from "../app/hooks"
import Header from "../chrome/Header"
import LoginPage from "./LoginPage"
import { ProjectsPage } from "./ProjectsPage"

export function LandingPage({

}: {

    }) {
    const auth = useAppSelector(state => state.firebase.auth)
    const isLoggedIn = !isEmpty(auth)

    return (
        <div className="bg-silk flex flex-col gap-4 min-h-screen">
            <Header project={undefined} />

            <div className="text-xl text-center text-darkplatinum">
                Map out your ideas, and progressively add structure
            </div>

            {isLoggedIn ? <ProjectsPage /> : <LoginPage />}

            <p className="text-center text-gray-500 p-2">Created by <a className="text-darkplatinum" href="https://adambinks.me">Adam Binks</a></p>
        </div>
    )
}