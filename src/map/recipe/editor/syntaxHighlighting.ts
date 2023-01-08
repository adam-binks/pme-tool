import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

export const highlighting = syntaxHighlighting(HighlightStyle.define([
    {
        tag: tags.bool, class: "cm-property",
    },
    { 
        tag: tags.lineComment, fontSize: "small", fontStyle: "italic", color: "#666", display: "block", margin: "0px 16px"
    },
]))