import { Extension } from "@codemirror/state";
import { clsx } from "@mantine/core";
import { useHover } from "@mantine/hooks";
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
import { pmelang, pmeLanguage } from './language';
import { panel } from "./panel";
import { highlighting } from "./syntaxHighlighting";



const extensions: Extension[] = [
    EditorView.baseTheme({
        ".cm-content": {
            fontFamily: "sans-serif",
            fontSize: "14px",
        }
    }),
    EditorView.lineWrapping,
    checkboxPlugin,
    pmelang(),
    pmeLanguage.data.of({ closeBrackets: { brackets: ["="] } }),
    highlighting,
    panel(),
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
                className={clsx("doNotPan text-left")}
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