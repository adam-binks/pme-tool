import { useMemo } from "react";
import Codemirror, { CodeMirrorProps } from "rodemirror";
// import ReactCodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { Class, Element } from "../../app/schema";
import { useBatchedTextInput } from "../../etc/batchedTextInput";
import { ExtensionParams, extensions } from "./extensions";


export function Editor({
    element,
    editable,
    updateContent,
    extensionParams,
    codemirrorProps,
}: {
    element: Element | Class
    editable: boolean
    updateContent: (newContent: string) => void
    extensionParams: ExtensionParams
    codemirrorProps?: CodeMirrorProps
}) {
    const batched = useBatchedTextInput(
        element.content,
        updateContent
    )

    const ext = useMemo(() => extensions(extensionParams), [extensionParams])

    return (
        <Codemirror
            // className={clsx("doNotPan text-left")}
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
                // editable={editable}
            }}
            // basicSetup={{
            //     lineNumbers: false,
            //     foldGutter: false,
            //     bracketMatching: false,
            //     highlightActiveLine: false,
            //     highlightSelectionMatches: false,
            //     autocompletion: false,
            // }}
            {...codemirrorProps}
        />
    )
}

// import { clsx } from "@mantine/core";
// import { useEffect, useMemo, useState } from "react";
// // import Codemirror, { CodeMirrorProps } from "rodemirror";
// import ReactCodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
// import { Class, Element } from "../../app/schema";
// import { useBatchedTextInput } from "../../etc/batchedTextInput";
// import { ExtensionParams, extensions } from "./extensions";


// export function Editor({
//     element,
//     editable,
//     updateContent,
//     extensionParams,
//     codemirrorProps,
// }: {
//     element: Element | Class
//     editable: boolean
//     updateContent: (newContent: string) => void
//     extensionParams: ExtensionParams
//     codemirrorProps?: ReactCodeMirrorProps
// }) {
//     const batched = useBatchedTextInput(
//         element.content,
//         updateContent
//     )

//     const ext = useMemo(() => extensions(extensionParams), [extensionParams])

//     return (
//         <ReactCodeMirror
//             className={clsx("doNotPan text-left")}
//             extensions={ext}
//             value={batched.value}
//             onChange={batched.onChangeValue}
//             onFocus={batched.onFocus}
//             onBlur={batched.onBlur}
//             editable={editable}
//             basicSetup={{
//                 lineNumbers: false,
//                 foldGutter: false,
//                 bracketMatching: false,
//                 highlightActiveLine: false,
//                 highlightSelectionMatches: false,
//                 autocompletion: false,
//             }}
//             {...codemirrorProps}
//         />
//     )
// }