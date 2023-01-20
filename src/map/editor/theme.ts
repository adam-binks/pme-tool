import { EditorView } from "codemirror";

export const theme = EditorView.theme({
    "&": {
        borderRadius: "10px",
    },
    "&.cm-editor.cm-focused": {
        outline: "none",
    },
    ".cm-content": {
        backgroundColor: "white",
        fontFamily: "sans-serif",
        fontSize: "12px",
        borderRadius: "5px",
    },
    ".schema-entry .cm-content": {
        fontStyle: "italic",
    },
    ".cm-property": {
        color: "#0000cc", fontWeight: "bold", backgroundColor: "#bbbbbb80", padding: "1px 3px",
        borderRadius: "5px"
    },
    ".cm-in-schema .cm-property": {
        backgroundColor: "#4baa4b80"
    },
})