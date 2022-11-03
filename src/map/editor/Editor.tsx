import { javascript } from '@codemirror/lang-javascript';
import { Extension } from "@codemirror/state";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "codemirror";
import { useDispatch } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { Element, getElementType } from "../../app/schema";
import { useBatchedTextInput } from "../../etc/batchedTextInput";
import { enact } from "../../etc/firestoreHistory";
import { updateElementCommand } from "../../state/mapFunctions";
import { useMapId } from "../Map";
import { checkboxPlugin } from './checkbox';



const extensions: Extension[] = [
    EditorView.baseTheme({
        ".cm-content": {
            fontFamily: "sans-serif",
            fontSize: "14px",
        }
    }),
    EditorView.lineWrapping,
    javascript(),
    checkboxPlugin,
]

interface EditorProps {
    element: Element,
}
export function Editor({ element }: EditorProps) {
    const firestore = useFirestore()
    const dispatch = useDispatch()
    const mapId = useMapId()

    const batched = useBatchedTextInput(
        element.content,
        (newValue) => enact(dispatch, mapId, updateElementCommand(
            firestore, mapId, element.id, getElementType(element),
            { content: element.content },
            { content: newValue }
        ))
    )

    return (
        <div className="pt-2">
            <CodeMirror
                className={"doNotPan text-left"}
                extensions={extensions}
                value={batched.value}
                onChange={batched.onChangeValue}
                onFocus={batched.onFocus}
                onBlur={batched.onBlur}
                basicSetup={{
                    lineNumbers: false,
                    foldGutter: false,
                    bracketMatching: false,
                    highlightActiveLine: false,
                }}
            />
        </div>
    )
}