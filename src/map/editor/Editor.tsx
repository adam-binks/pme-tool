import { useMemo } from "react";
import Codemirror, { CodeMirrorProps } from "rodemirror";
import { useBatchedTextInput } from "../../etc/batchedTextInput";
import { ExtensionParams, extensions } from "./extensions";


export function Editor({
    content,
    editable, // TODO
    updateContent,
    extensionParams,
    codemirrorProps,
}: {
    content: string
    editable: boolean
    updateContent: (newContent: string) => void
    extensionParams: ExtensionParams
    codemirrorProps?: CodeMirrorProps
}) {
    const batched = useBatchedTextInput(
        content,
        updateContent
    )

    const ext = useMemo(() => extensions(extensionParams), [extensionParams])

    return (
        // <></>
        <Codemirror
            key="element editor"
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
            {...codemirrorProps}
        />
    )
}