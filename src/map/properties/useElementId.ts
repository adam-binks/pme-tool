import React, { useContext } from "react"
import { elementType } from "../../app/schema"

// for elements (nodes, arrows, etc) that can have properties
export const ElementContext = React.createContext<{
    elementType: elementType
    elementId: string
}>({elementType: "node", elementId: "ERROR: ELEMENT CONTEXT UNDEFINED"})
export const useElementId =() => useContext(ElementContext)