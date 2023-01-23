import { ColorInput } from "@mantine/core"
import { elementType } from "../../app/schema"

export const ELEMENT_COLOURS : {[key in elementType]: string[]} = {
    "node": ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"],
    "arrow": ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"],
}

export function ColourPicker({
    color,
    onChange,
    elementType,
}: {
    color: string
    onChange: (color: string) => void
    elementType: elementType
}) {

    return (
        <ColorInput
            styles={{
                input: {
                    width: "0px",
                    padding: "0px",
                    border: "none",
                    background: "transparent",
                },
                preview: {
                    padding: "0px",
                }
            }}
            size="xs"
            value={color}
            onChange={(newCol) => newCol !== color && onChange(newCol)}
            placeholder="Pick color"
            disallowInput
            withPicker={false}
            swatches={ELEMENT_COLOURS[elementType]}
            swatchesPerRow={8}
        />
    )
}