import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../app/hooks"
import { Map } from '../common/mapActions'
import { renameMap } from "../reducers/mapFunctions"
import { closePane } from "../reducers/paneReducer"

interface MapHeaderProps {
    map: Map
    paneIndex: number
}
export default function MapHeader({ map, paneIndex }: MapHeaderProps) {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    return (
        <div>
            <p>Map {map.id}</p>
            <input value={map.name} onChange={(e) => renameMap(firestore, map.id, e.target.value)}
            />
            <button 
                onClick={() => dispatch(closePane(paneIndex))}
                >Close pane</button>
        </div>
    )
}