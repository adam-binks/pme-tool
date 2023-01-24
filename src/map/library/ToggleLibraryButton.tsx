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
            className="-mr-2 text-right bg-silk text-black rounded-l-full mb-2"
            variant="filled"
            onClick={() => dispatch(toggleLibrary(mapId))}
            rightIcon={libraryOpen ? <IconBook /> : <IconBook2 />}
        >
            {libraryOpen ? "Close library" : "Open library"}
        </Button>
    )
}