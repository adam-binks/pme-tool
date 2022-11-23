import { useFirestore } from "react-redux-firebase";
import { useAppDispatch } from "../../app/hooks";
import { Element, elementType } from "../../app/schema";
import { enact } from "../../etc/firestoreHistory";
import { useClassProperties } from "../../state/localReducer";
import { updateElementCommand } from "../../state/mapFunctions";
import { useMapId } from "../Map";
import { Editor } from "./Editor";
import { Property } from "./exposeProperties";

export function TextElement({
    element,
    elementType,
} :
{
    element: Element,
    elementType: elementType,
}) {
    const mapId = useMapId()
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    const updateContent = (newValue: string) => enact(dispatch, mapId, updateElementCommand(
        firestore, mapId, element.id, elementType,
        { content: element.content },
        { content: newValue }
    ))

    const classProperties = useClassProperties(mapId, element.classId)

    return (
        <Editor
            element={element}
            updateContent={updateContent}
            extensionParams={{
                onUpdateProperties: (properties: Property[]) => { },
                propertiesToHighlight: classProperties.map(
                    (p: Property) => ({ name: p.name, highlight: "in schema" })
                ),
            }}
        />
    )
}