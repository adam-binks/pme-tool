import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../app/hooks"
import { renameMap } from "../reducers/mapFunctions"
import { closePane } from "../reducers/paneReducer"
import { Map } from "../app/schema"
import styles from "./MapHeader.module.css"

interface MapHeaderProps {
    map: Map
    paneIndex: number
    divRef: React.RefObject<HTMLDivElement>
}
export default function MapHeader({ map, paneIndex, divRef }: MapHeaderProps) {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    return (
        <div ref={divRef} className={styles.MapHeader}>
            <p>Map {map.id}</p>
            <input 
                value={map.name} 
                onChange={(e) => renameMap(firestore, map.id, e.target.value)}
            />
            <button
                onClick={() => dispatch(closePane(paneIndex))}
            >Close pane</button>
        </div>
    )
}