import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

export const highlighting = syntaxHighlighting(HighlightStyle.define([
    {
        tag: tags.bool, class: "cm-property",
    },
    { 
        tag: tags.lineComment, fontSize: "10px", fontStyle: "italic", color: "#5E806C", display: "inline-block", margin: "0px 16px"
    },
    {
        tag: tags.controlKeyword, color: "#da4a8a", fontWeight: "bold", backgroundColor: "#bbbbbb51", padding: "1px 3px",
    }
]))