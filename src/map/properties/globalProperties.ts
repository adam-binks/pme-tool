import { AbstractProperty } from "../../app/schema";

export const textUntitled = "text_untitled"
export const globalProperties: AbstractProperty[] = [
    {
        id: "title",
        name: "Title",
        type: "title",
    },
    {
        id: textUntitled,
        name: "Type some text...",
        type: textUntitled,
    },
]