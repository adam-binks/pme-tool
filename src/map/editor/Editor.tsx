import { clsx } from "@mantine/core";
import CodeMirror from "@uiw/react-codemirror";
import { useDispatch } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { Class, Element } from "../../app/schema";
import { useBatchedTextInput } from "../../etc/batchedTextInput";
import { useMapId } from "../Map";
import { Property } from "./expose_properties";
import { extensions } from "./extensions";


export function Editor({
    element,
    updateContent,
    onUpdateProperties,
}: {
    element: Element | Class
    updateContent: (newContent: string) => void
    onUpdateProperties: (properties: Property[]) => void
}) {
    const firestore = useFirestore()
    const dispatch = useDispatch()
    const mapId = useMapId()

    const batched = useBatchedTextInput(
        element.content,
        updateContent
    )

    return (
        <div className="pt-2">
            <CodeMirror
                className={clsx("doNotPan text-left")}
                extensions={extensions(onUpdateProperties)}
                value={batched.value}
                onChange={batched.onChangeValue}
                onFocus={batched.onFocus}
                onBlur={batched.onBlur}
                basicSetup={{
                    lineNumbers: false,
                    foldGutter: false,
                    bracketMatching: false,
                    highlightActiveLine: false,
                    highlightSelectionMatches: false,
                    autocompletion: false,
                }}
            />
        </div>
    )
}