import { useHotkeys } from "react-hotkeys-hook";
import { useAppDispatch } from "../app/hooks";
import { redo, undo } from "../state/historyReducer";

function addCmd(hotkeys: string[]) {
    const hotkeysWithCmd = hotkeys.filter(hotkey => hotkey.includes("ctrl"))
        .map(hotkey => hotkey.replace("ctrl", "cmd"))
    return [...hotkeys, ...hotkeysWithCmd]
}

export function useMapHotkeys(mapId: string) {
    const dispatch = useAppDispatch()

    const sep = ", "
    const undoKeys = addCmd(["ctrl+z"])
    const redoKeys = addCmd(["ctrl+y", "ctrl+shift+z"])

    const hotkeys = [undoKeys, redoKeys].map(h => h.join(sep)).join(sep)

    // returns a ref, which should be applied to a focusable div (e.g. has tabIndex = -1)
    return useHotkeys<HTMLDivElement>(hotkeys, (e, handler) => {
        if (undoKeys.includes(handler.key)) {
            dispatch(undo(mapId))
        } else if (redoKeys.includes(handler.key)) {
            dispatch(redo(mapId))
        } else {
            console.error(`Unhandled hotkey: ${handler.key}`)
        }
    }, [mapId, dispatch])
}