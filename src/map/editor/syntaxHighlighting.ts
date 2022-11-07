import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { tagEquals } from "./language";

export const highlighting = syntaxHighlighting(HighlightStyle.define([
    { tag: tags.className, color: "#0000ff", fontWeight: "bold", backgroundColor: "#ddd", padding: "0px 2px", 
        border: "1px #bbb solid", borderRadius: "5px" },
    { tag: tagEquals, fontSize: "smaller", color: "#aaa", padding: "0 2px" },
]))