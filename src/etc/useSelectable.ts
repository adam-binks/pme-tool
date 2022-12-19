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
    setSelection: (val: Selection) => void
]>([emptySelection, () => { }])
export const useSelection = () => useContext(SelectionContext)


export function useSelectable(id: string, type: "node" | "arrow" | "class") {
    const [selection, setSelection] = useSelection()
    const typeIds = `${type}Ids`
    const selectionTypeIds = selection && selection[`${type}Ids`]
    const isSelected = selectionTypeIds?.includes(id)

    return {
        selection,
        setSelection,
        isSelected,
        onMousedownSelectable: (e: React.MouseEvent) => {
            if (e.shiftKey) {
                // toggle inclusion in selection
                if (isSelected) {
                    setSelection({
                        ...selection,
                        [typeIds]: selectionTypeIds ? selectionTypeIds.filter((elementId: string) => elementId !== id) : []
                    })
                } else {
                    setSelection({
                        ...selection,
                        [typeIds]: [...selectionTypeIds, id]
                    })
                }
            } else if (!isSelected) {
                // replace selection (unless this is already in the selection)
                setSelection({...emptySelection, [typeIds]: [id] })
            }
        },
    }
}