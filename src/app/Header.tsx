import { useFirestore } from "react-redux-firebase"
import { createMap } from "../reducers/mapFunctions"
import { openPane } from "../reducers/paneReducer"
import { useAppDispatch } from "./hooks"

export default function Header() {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    return (
        <div className="Header">
            <button onClick={async () => {
                const id = createMap(firestore)
                dispatch(openPane({ id, addingArrowFrom: undefined }))
            }}>Create map</button>
        </div>
    )
}