import { createMap, openPane } from "../common/mapActions"
import { generateId } from "../etc/helpers"
import { useAppDispatch } from "./hooks"

export default function Header() {
    const dispatch = useAppDispatch()
    return (
        <div style={{backgroundColor: "#eee", width: "100%", height: "50px"}}>
            <button onClick={async () => {
                const newMapId = generateId()
                try {
                    await dispatch.sync(createMap({id: newMapId}))
                } catch {
                    console.log('Error creating map')
                }
                dispatch(openPane({pane: {id: newMapId}}))
            }}>Create map</button>
        </div>
    )
}