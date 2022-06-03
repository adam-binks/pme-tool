import { useAppDispatch } from "../app/hooks"
import { closePane, Map, renameMap } from "../common/mapActions"

interface MapHeaderProps {
    map: Map
    paneIndex: number
}
export default function MapHeader({ map, paneIndex }: MapHeaderProps) {
    const dispatch = useAppDispatch()

    return (
        <div>
            <p>Map {map._id}</p>
            <input value={map.name} onChange={(e) => dispatch.sync(renameMap({ id: map._id, name: e.target.value }))} />
            <button onClick={() => dispatch(closePane({ paneIndex }))}>Close pane</button>
        </div>
    )
}