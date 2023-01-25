import { EditorView } from "codemirror";

export const theme = EditorView.theme({
    "&": {
        borderRadius: "10px",
    },
    "&.cm-editor.cm-focused": {
        outline: "none",
    },
    ".cm-content": {
        // backgroundColor: "#F8EDEB",
        color: "black",
        fontFamily: "sans-serif",
        fontSize: "12px",
        borderRadius: "5px",
        cursor: "text",
    },
    ".schema-entry .cm-content": {
        fontStyle: "italic",
    },
    ".cm-property": {
        borderRadius: "5px",
        padding: "0 4px",
        backgroundColor: "#fae6dd",
    },
    ".cm-in-schema .cm-property": {
        backgroundColor: "var(--element-colour)",
    },
    ".cm-equals": {
        fontSize: "smaller", color: "#aaa", padding: "0 2px"
    },
    ".cm-equals:first-of-type": {
        marginLeft: "8px",
    }
})