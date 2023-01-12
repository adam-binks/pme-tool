import { EditorState } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { clsx } from "@mantine/core"
import { useCallback, useMemo } from "react"
import { useFirestore } from "react-redux-firebase"
import Codemirror from "rodemirror"
import { useAppDispatch } from "../../../app/hooks"
import { useBatchedTextInput } from "../../../etc/batchedTextInput"
import { recipeExtensions } from "./recipeExtensions"
import { ExecuteCommandFunc } from "./runCommandPlugin"

export function RecipeEditor({
    content,
    onUpdate,
    inLibrary = false,
    editable = true,
}: {
    content: string
    onUpdate: (newContent: string) => void
    inLibrary?: boolean
    editable?: boolean
}) {
    const batched = useBatchedTextInput(
        content,
        onUpdate,
    )

    const dispatch = useAppDispatch()
    const firestore = useFirestore()
    const execute = useCallback((execute: ExecuteCommandFunc) => {
        execute(dispatch, firestore)
    }, [dispatch])

    const ext = useMemo(() => [
        ...recipeExtensions({ execute }),
        ...(editable ? [] : [EditorState.readOnly.of(true), EditorView.editable.of(false)])
    ], [])

    return (
        <div className={clsx(inLibrary && "flex-grow", "p-1")}>
            <Codemirror
                key={"recipe"}
                extensions={ext}
                value={batched.value}
                onUpdate={(update) => {
                    if (update.docChanged) {
                        const value = update.state.doc.toString()
                        value && batched.onChangeValue(value, update)
                    }
                }}
                elementProps={{
                    className: "text-left doNotPan",
                    onFocus: batched.onFocus,
                    onBlur: batched.onBlur,
                }}
            />
        </div>
    )
}