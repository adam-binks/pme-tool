import { clsx } from "@mantine/core";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { Class, Element } from "../../app/schema";
import { useBatchedTextInput } from "../../etc/batchedTextInput";
import { ExtensionParams, extensions } from "./extensions";


export function Editor({
    element,
    updateContent,
    extensionParams,
    codemirrorProps,
}: {
    element: Element | Class
    updateContent: (newContent: string) => void
    extensionParams: ExtensionParams
    codemirrorProps?: ReactCodeMirrorProps
}) {
    const batched = useBatchedTextInput(
        element.content,
        updateContent
    )

    return (
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
            {...codemirrorProps}
        />
    )
}