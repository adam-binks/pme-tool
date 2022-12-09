import { Button } from "@mantine/core";
import { IconBook, IconBook2 } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Pane, toggleLibrary } from "../../state/paneReducer";
import { useMapId } from "../Map";

export function ToggleLibraryButton({

}: {

}) {
    const mapId = useMapId()
    const dispatch = useAppDispatch()

    const libraryOpen = useAppSelector(state => state.panes?.find((p: Pane) => p.id === mapId)?.libraryOpen)
    return (
        <Button
            className="-mr-2 text-right bg-slate-500 rounded-l-full"
            variant="filled"
            color={"cyan"}
            onClick={() => dispatch(toggleLibrary(mapId))}
            rightIcon={libraryOpen ? <IconBook /> : <IconBook2 />}
        >
            {libraryOpen ? "Close library" : "Open library"}
        </Button>
    )
}