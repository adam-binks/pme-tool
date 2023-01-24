import { ColorInput } from "@mantine/core"
import { elementType } from "../../app/schema"

export const ELEMENT_COLOURS : {[key in elementType]: string[]} = {
    "node": ["#fec5bb","#fcd5ce","#fae1dd","#f8edeb","#e8e8e4","#d8e2dc","#ece4db","#ffe5d9","#ffd7ba","#fec89a"],
    "arrow": ["#fec5bb","#fcd5ce","#fae1dd","#f8edeb","#e8e8e4","#d8e2dc","#ece4db","#ffe5d9","#ffd7ba","#fec89a"],
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