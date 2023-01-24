import { EditorView } from "codemirror";

export const theme = EditorView.theme({
    "&": {
        borderRadius: "10px",
    },
    "&.cm-editor.cm-focused": {
        outline: "none",
    },
    ".cm-content": {
        backgroundColor: "#f8edeb",
        color: "black",
        fontFamily: "sans-serif",
        fontSize: "12px",
        borderRadius: "5px",
    },
    ".schema-entry .cm-content": {
        fontStyle: "italic",
    },
    ".cm-property": {
        borderRadius: "5px",
        padding: "0 4px",
        backgroundColor: "#fcd5ce",
    },
    ".cm-in-schema .cm-property": {
        backgroundColor: "var(--element-colour, #4baa4b80)",
    },
    ".cm-equals": {
        fontSize: "smaller", color: "#aaa", padding: "0 2px"
    },
    ".cm-equals:first-of-type": {
        marginLeft: "8px",
    }
})