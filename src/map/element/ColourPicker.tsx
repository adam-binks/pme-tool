import { ColorInput } from "@mantine/core"
import { elementType } from "../../app/schema"

export const ELEMENT_COLOURS : {[key in elementType]: string[]} = {
    "node": ['#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14'],
    "arrow": ['#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14'],
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