import React, { useContext } from "react";

export interface Selection {
    nodeIds: string[]
    arrowIds: string[]
    classIds: string[]
}
export const emptySelection: Selection = {
    nodeIds: [],
    arrowIds: [],
    classIds: [],
}
export const SelectionContext = React.createContext<[
    selection: Selection,
    setSelection: React.Dispatch<React.SetStateAction<Selection>>
]>([emptySelection, () => { }])
export const useSelection = () => useContext(SelectionContext)


export function useSelectable(id: string, type: "node" | "arrow") {
    const [selection, setSelection] = useSelection()
    const selectionTypeIds = selection && selection[`${type}Ids`]
    const isSelected = selectionTypeIds?.includes(id)

    return {
        selection,
        setSelection,
        isSelected,
        onClickSelectable: (e: React.MouseEvent) => {
            if (e.shiftKey) {
                // toggle inclusion in selection
                if (isSelected) {
                    setSelection({
                        ...selection,
                        nodeIds: selectionTypeIds ? selectionTypeIds.filter((elementId: string) => elementId !== id) : []
                    })
                } else {
                    setSelection({
                        ...selection,
                        nodeIds: [...selectionTypeIds, id]
                    })
                }
            } else {
                // replace selection
                setSelection({...emptySelection, [`${type}Ids`]: [id] })
            }
        },
    }
}