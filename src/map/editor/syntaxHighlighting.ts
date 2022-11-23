import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Decoration, DecorationSet, EditorView, MatchDecorator, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { escapeRegExp } from "lodash";
import { tagEquals } from "./language";

export const highlighting = syntaxHighlighting(HighlightStyle.define([
    {
        tag: tags.className, class: "cm-property"
    },
    { tag: tagEquals, fontSize: "smaller", color: "#aaa", padding: "0 2px" },
]))

export type PropertiesToHighlight = { name: string, highlight: "in schema" }[]
export const getPropertyMatcher = (propertiesToHighlight: PropertiesToHighlight) => new MatchDecorator({
    // generates regex like "\=(prop 1)|(prop 2)|(prop 3)\="
    regexp: new RegExp( "\=(?:" + 
        propertiesToHighlight.map(p => `(?:${escapeRegExp(p.name)})`).join("|") +
        `)\=`,
        "g"),
    decoration: match => { return Decoration.mark({ class: "cm-in-schema" }); },
})

export const dynamicHighlighting = (propertiesToHighlight: PropertiesToHighlight) => [
    ViewPlugin.fromClass(class {
        placeholders: DecorationSet
        propertyMatcher: MatchDecorator
        constructor(view: EditorView) {
            this.propertyMatcher = getPropertyMatcher(propertiesToHighlight)
            this.placeholders = this.propertyMatcher.createDeco(view)
        }
        update(update: ViewUpdate) {
            this.placeholders = this.propertyMatcher.updateDeco(update, this.placeholders)
        }
    }, {
        decorations: instance => instance.placeholders,
    }),
    EditorView.baseTheme({
        ".cm-property": {
            color: "#0000cc", fontWeight: "bold", backgroundColor: "#bbbbbb80", padding: "1px 3px",
            borderRadius: "5px"
        },
        ".cm-in-schema .cm-property": { backgroundColor: "#4baa4b80" },
    })
]