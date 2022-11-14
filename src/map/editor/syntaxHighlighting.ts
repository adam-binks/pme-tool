import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { tagEquals } from "./language";

export const highlighting = syntaxHighlighting(HighlightStyle.define([
    { tag: tags.className, color: "#0000cc", fontWeight: "bold", backgroundColor: "#bbbbbb80", padding: "1px 3px", 
        borderRadius: "5px" },
    { tag: tagEquals, fontSize: "smaller", color: "#aaa", padding: "0 2px" },
]))