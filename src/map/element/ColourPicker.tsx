import { ColorInput } from "@mantine/core"
import { elementType } from "../../app/schema"

export const ELEMENT_COLOURS : {[key in elementType]: string[]} = {
    "node": ["#fec5bb","#fae1dd","#c5edd6","#d8e2dc","#ece4db","#ffd7ba","#fec89a", "#c6c5ed"],
    "arrow": ["#fec5bb","#fae1dd","#c5edd6","#d8e2dc","#ece4db","#ffd7ba","#fec89a", "#c6c5ed"],
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