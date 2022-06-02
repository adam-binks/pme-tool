import Split from "../lib/react-split";
import { useAppSelector } from "../app/hooks";
import Map from "./Map";
import "./Panes.css"

export default function Panes() {
    const panes = useAppSelector(state => state.panes)

    if (panes.length === 0) {
        return (<p>Open a map!</p>)
    }
    return (
        <>
            <Split
                className="split-flex"
                direction="horizontal"
                aria-roledescription={`Split screen into ${panes.length}`}
            >
                {panes.map((pane, paneIndex) =>
                    <Map
                        id={pane.id}
                        key={pane.id}
                        paneIndex={paneIndex}
                    />
                )}
            </Split>
        </>
    )
}