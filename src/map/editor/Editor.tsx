import { clsx } from "@mantine/core";
import CodeMirror from "@uiw/react-codemirror";
import { useDispatch } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { Class, Element } from "../../app/schema";
import { useBatchedTextInput } from "../../etc/batchedTextInput";
import { useMapId } from "../Map";
import { ExtensionParams, extensions } from "./extensions";


export function Editor({
    element,
    updateContent,
    extensionParams,
}: {
    element: Element | Class
    updateContent: (newContent: string) => void
    extensionParams: ExtensionParams
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
                extensions={extensions(extensionParams)}
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