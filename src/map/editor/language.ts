import { LanguageSupport, LRLanguage } from "@codemirror/language"
import { styleTags, tags as t } from "@lezer/highlight"
import { parser } from "./parser"

export const tagEquals = t.meta

const parserWithMetadata = parser.configure({
    props: [
        styleTags({
            PropertyName: t.className,
            PropertyValue: t.attributeValue,
            BooleanValue: t.bool,
            "=": tagEquals,
        }),
        // indentNodeProp.add({
        //     Application: context => context.column(context.node.from) + context.unit
        // }),
        // foldNodeProp.add({
        //     Application: foldInside
        // })
    ]
})

const pmeLanguage = LRLanguage.define({
    parser: parserWithMetadata,
    languageData: {
        commentTokens: { line: ";" }
    }
})

export function pmelang() {
    return new LanguageSupport(pmeLanguage)
}