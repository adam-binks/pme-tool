import { CompletionContext } from "@codemirror/autocomplete"
import { EditorView } from "codemirror"
import { pmeLanguage } from "./language"

const options = [
    "constructor", "deprecated", "link", "param", "returns", "type"
].map(tag => ({ label: tag, type: "class" }))

function completeJSDoc(context: CompletionContext) {
    // let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)
    // let node = syntaxTree(context.state).resolveInner(context.pos, 0)
    // if (node.name != "PropertyName" ||
    //     context.state.sliceDoc(node.from, node.from + 1) != "=") {
    //     console.log(node)
    //     return null
    // }
    if (!context.matchBefore(/^=[^=]*/)) {
        return null
    }
    let word = context.matchBefore(/\w*/)
    if (!word) {
        return null
    }
    return {
        from: word.from,
        options
    }

    // let textBefore = context.state.sliceDoc(nodeBefore.from, context.pos)
    // let tagBefore = /=\w*$/.exec(textBefore)
    // if (!tagBefore && !context.explicit) return null
    // return {
    //     from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
    //     options: tagOptions,
    //     validFor: /^(=\w*)?$/
    // }
}

export const autocompleteTheme = EditorView.baseTheme({
    ".cm-tooltip-autocomplete.cm-tooltip": {
        // backgroundColor: "red",
    },
})

export function autocomplete() {
    return [
        pmeLanguage.data.of({
            autocomplete: completeJSDoc
        }),
    ]
} 