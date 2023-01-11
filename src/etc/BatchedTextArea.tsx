import { Textarea, TextareaProps } from "@mantine/core"
import { useBatchedTextInput } from "./batchedTextInput"

export function BatchedTextArea({
    content,
    onUpdate,
    textareaProps,
}: {
    content: string
    onUpdate: (newContent: string) => void
    textareaProps?: Partial<TextareaProps>
}) {
    const batched = useBatchedTextInput(content, onUpdate)

    const defaultProps: Partial<TextareaProps> = {
        autosize: true,
    }

    return (
        <Textarea
            value={batched.value}
            onChange={batched.onChange}
            onBlur={batched.onBlur}
            onFocus={batched.onFocus}
            {...{
                ...defaultProps,
                ...textareaProps,
            }}
        />
    )
}