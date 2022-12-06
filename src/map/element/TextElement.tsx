import { useForceUpdate } from "@mantine/hooks";
import { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch } from "../../app/hooks";
import { Arrow, Element, elementType } from "../../app/schema";
import { Command, enact, enactAll } from "../../etc/firestoreHistory";
import { useClassProperties } from "../../state/localReducer";
import { getPropertiesFromContent, updateElementCommand } from "../../state/mapFunctions";
import { useConnectedArrows } from "../../state/mapSelectors";
import { getArrowDotPropertyClass } from "../editor/arrowDotWidgets";
import { Editor } from "../editor/Editor";
import { Property } from "../editor/exposeProperties";
import { useMapId } from "../Map";
import { ArrowDot } from "./ArrowDot";

export function TextElement({
    element,
    elementType,
    codemirrorProps,
}:
    {
        element: Element,
        elementType: elementType,
        codemirrorProps?: Partial<ReactCodeMirrorProps>
    }) {
    const mapId = useMapId()
    const dispatch = useAppDispatch()
    const firestore = useFirestore()
    const forceUpdate = useForceUpdate()

    const connectedArrows = useConnectedArrows(element.id, elementType, "all")

    const [properties, setProperties] = useState<Property[]>(getPropertiesFromContent(element.content))
    useEffect(() => {
        setTimeout(() => {
            forceUpdate()
        }, 0)
    }, [])

    const onUpdateProperties = (newProps: Property[]) => {
        if (newProps !== properties) {
            if (connectedArrows && connectedArrows.length > 0) {
                const commands: Command[] = []

                connectedArrows.forEach((arrow: Arrow) => {
                    [{end: arrow.source, endType: "source"}, {end: arrow.dest, endType: "dest"}].forEach(
                        ({end, endType}) => {
                            if (end.elementId === element.id && end.property) {
                                const arrowProperty = end.property
                                const newPropName = newProps?.[arrowProperty.index]?.name
                                if (newPropName !== arrowProperty.name) {
                                    const propertyWithName = newProps.find((prop) => prop.name === arrowProperty.name)
                                    // TODO: handle case where property is deleted by looping through twice
                                    const updatedArrowEndProperty = (propertyWithName !== undefined) ?
                                        // has the property been moved?
                                        // if the property with the same name exists, update index to use that
                                        { index: newProps.indexOf(propertyWithName), name: arrowProperty.name }
                                        :
                                        // has the property been renamed?
                                        // otherwise, update the name to the name of the property with the same index
                                        { name: newPropName, index: arrowProperty.index }

                                    commands.push(updateElementCommand(
                                        firestore, mapId, arrow.id, "arrow",
                                        { [endType]: end },
                                        { [endType]: {...end, property: updatedArrowEndProperty } },
                                    ))
                                }
                            }
                        }
                    )
                })

                if (commands.length > 0) {
                    enactAll(dispatch, mapId, commands)
                }
            }

            setProperties(newProps)
        }
    }

    const updateContent = (newValue: string) => enact(dispatch, mapId, updateElementCommand(
        firestore, mapId, element.id, elementType,
        { content: element.content },
        { content: newValue }
    ))

    const classProperties = useClassProperties(mapId, element.classId)

    return (
        <>
            <div className={`text-element-${element.id}`}>
                <Editor
                    element={element}
                    updateContent={updateContent}
                    extensionParams={{
                        onUpdateProperties: onUpdateProperties,
                        propertiesToHighlight: classProperties.map(
                            (p: Property) => ({ name: p.name, highlight: "in schema" })
                        ),
                    }}
                    codemirrorProps={codemirrorProps}
                />
                {properties.map((p: Property, index) => {
                    const arrowDot = document.querySelector(`.text-element-${element.id} .${getArrowDotPropertyClass(p.name)}`)
                    return arrowDot &&
                        ReactDOM.createPortal(
                            <ArrowDot element={element} property={{ name: p.name, index }} />,
                            arrowDot
                        )
                }
                )}
            </div>
        </>
    )
}