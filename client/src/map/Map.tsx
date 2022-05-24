import React from "react";

interface MapProps {
    id: string
}
export default function Map({ id }: MapProps) {
    return (
        <div style={{backgroundColor: "#eee", height: "100%", width: "100%"}}>
            <p>Map {id}</p>
        </div>
    )
}