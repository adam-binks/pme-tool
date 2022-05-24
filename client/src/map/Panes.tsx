import React from "react";
import Split from "react-split";
import Map from "./Map";
import "./Panes.css"

export default function Panes() {
    const mapIds = ["id_one", "id_two"]
    return (
        <Split
            className="split-flex"
            direction="horizontal"
            sizes={[25, 75]}
        >
            {mapIds.map(mapId =>
                <Map
                    id={mapId}
                    key={mapId}
                />
            )}
        </Split>
    )
}