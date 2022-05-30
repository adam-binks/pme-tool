import React from "react";
import Split from "react-split";
import Map from "./Map";
import "./Panes.css"

export default function Panes() {
    const mapIds = ["e9f434dcb93153863e12595f", "62492c1c34443ef55f952dfe"]
    return (
        <Split
            className="split-flex"
            direction="horizontal"
            sizes={[50, 50]}
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