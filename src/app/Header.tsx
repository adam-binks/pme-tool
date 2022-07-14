import { useFirestore } from "react-redux-firebase"
import { toast } from "react-toastify"
// import { createMap, openPane } from "../common/mapActions"
import { generateId } from "../etc/helpers"
import { openPane } from "../reducers/paneReducer"
import { useAppDispatch } from "./hooks"

export default function Header() {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    return (
        <div style={{ backgroundColor: "#eee", width: "100%", height: "50px" }}>
            <button onClick={async () => {
                const mapRef = await firestore.collection('maps').add({ name: "New map 3" })
                console.log(`ref: ${mapRef.id}`)
                dispatch(openPane({ id: mapRef.id }))
            }}>Create map</button>
        </div>
    )
}