import { ActionIcon, Menu, Tabs, TextInput } from "@mantine/core";
import { IconCornerUpLeft, IconCornerUpRight, IconDots, IconLayoutColumns, IconPlus, IconSitemap, IconTrash, IconX } from "@tabler/icons";
import { useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Map, Project } from "../app/schema";
import { useBatchedTextInput } from "../etc/batchedTextInput";
import { redo, undo } from "../state/historyReducer";
import { createMap, deleteMap, renameMap } from "../state/mapFunctions";
import { useFirestoreData } from "../state/mapSelectors";
import { closePane, defaultPane, Pane, setPanes } from "../state/paneReducer";

export function MapTabs({
    mapIds,
    paneIndex,
    isOnlyPane,
    project,
}: {
    mapIds: string[],
    paneIndex: number,
    isOnlyPane: boolean,
    project: Project,
}) {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    const panes = useAppSelector(state => state.panes)
    const activeMap = panes[paneIndex]?.id
    const setActiveMap = (id: string) => dispatch(setPanes(
        panes.map((pane: Pane, i: number) => (i === paneIndex) ? { ...pane, id } : pane)
    ))

    const history = useAppSelector(state => state.history[activeMap])

    const mapNames: { name: string, id: string }[] = useFirestoreData(data => data?.maps && Object.values(data.maps)?.map(
        (map) => ({ id: (map as Map)?.id, name: (map as Map)?.name })
    ))

    const [editingActiveTab, setEditingActiveTab] = useState(false)
    const activeMapName = mapNames && mapNames.find(map => map.id === activeMap)?.name || ""
    const batchedNameInput = useBatchedTextInput(
        activeMapName,
        (value) => renameMap(firestore, dispatch, activeMap, activeMapName, value)
    )

    return (
        <div className="flex overflow-x-auto-auto flex-nowrap">
            <div className="flex-grow overflow-x-auto">
                <Tabs
                    keepMounted={false}
                    value={activeMap}
                    onTabChange={(value) => {
                        setEditingActiveTab(false)
                        value && setActiveMap(value)
                    }}
                    color="orange"
                    styles={{
                        root: {
                            backgroundColor: "#f8f2eb",
                        }
                    }}
                    className="z-10"
                >
                    <Tabs.List>
                        {mapIds.map(mapId => (
                            <Tabs.Tab
                                icon={<IconSitemap size="14" color="grey" />}
                                key={mapId}
                                value={mapId}
                                rightSection={
                                    <Menu shadow="md" width={200} position="bottom-start" withinPortal>
                                        <Menu.Target>
                                            <ActionIcon component="a" mt={-5} radius="xl" className="my-auto" size="xs"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <IconDots />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete this map? This cannot be undone.")) {
                                                        setEditingActiveTab(false)
                                                        deleteMap(firestore, mapId, project)
                                                    }
                                                }}
                                                icon={<IconTrash size={14} />}
                                            >
                                                Delete map
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                }
                                onClick={() => {
                                    if (activeMap === mapId) {
                                        setEditingActiveTab(!editingActiveTab)
                                    }
                                }}
                            >
                                {(editingActiveTab && activeMap === mapId) ?
                                    <TextInput
                                        variant="filled"
                                        size="xs"
                                        value={batchedNameInput.value}
                                        onChange={batchedNameInput.onChange}
                                        onBlur={() => { batchedNameInput.onBlur(); setEditingActiveTab(false) }}
                                        onFocus={batchedNameInput.onFocus}
                                        autoFocus={true}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => {
                                            // don't let arrow keys change tab
                                            if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === " ") {
                                                e.stopPropagation()
                                            }
                                        }}
                                        onKeyUp={(e) => {
                                            // don't let space steal focus
                                            if (e.key === " ") {
                                                e.stopPropagation()
                                                e.preventDefault()
                                            }
                                            if (e.key === "Enter") {
                                                setEditingActiveTab(false)
                                            }
                                        }}
                                    />
                                    :
                                    <p>{mapNames?.find(mapName => mapName.id === mapId)?.name}</p>
                                }

                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs>
            </div>

            <div
                className="flex h-full gap-6 px-2 bg-seashell"
                style={{
                    borderBottom: '2px solid #dee2e6' // copy of Tabs bottom border
                }}
            >
                <div className="flex gap-2">
                    <ActionIcon
                        title="Undo"
                        onClick={() => dispatch(undo(activeMap))}
                        className="my-auto border-none bg-seashell"
                        disabled={!history || (history.undo.length === 0)}
                    >
                        <IconCornerUpLeft className="bg-seashell hover:bg-white border-none outline-none border-0" />
                    </ActionIcon>
                    <ActionIcon
                        title="Redo"
                        onClick={() => dispatch(redo(activeMap))}
                        className="my-auto border-none bg-seashell"
                        disabled={!history || (history.redo.length === 0)}
                    >
                        <IconCornerUpRight className="bg-seashell hover:bg-white border-none outline-none border-0" />
                    </ActionIcon>
                    {!isOnlyPane &&
                        <ActionIcon
                            title="Close map"
                            onClick={() => dispatch(closePane(paneIndex))}
                            className="my-auto"
                        >
                            <IconX />
                        </ActionIcon>
                    }
                </div>
                <div className="flex gap-2">
                    <ActionIcon className="my-auto" title="Add new map to project"
                        onClick={() => {
                            const newMapId = createMap(firestore, "New map", project)
                            dispatch(setPanes([
                                ...panes.slice(0, paneIndex + 1),
                                { ...defaultPane, id: newMapId },
                                ...panes.slice(paneIndex + 1)
                            ]))
                        }}
                    >
                        <IconPlus />
                    </ActionIcon>
                    <ActionIcon className="my-auto" title="Open split view"
                        onClick={() => {
                            const newMapIndex = Math.min(mapIds.indexOf(activeMap) + 1, mapIds.length - 1)
                            dispatch(setPanes([
                                ...panes.slice(0, paneIndex + 1),
                                { ...defaultPane, id: mapIds[newMapIndex] },
                                ...panes.slice(paneIndex + 1)
                            ]))
                        }}
                    >
                        <IconLayoutColumns />
                    </ActionIcon>
                </div>
            </div>
        </div>
    )
}