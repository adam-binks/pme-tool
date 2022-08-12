import Select from "react-select";
import { Property } from "../../app/schema";
import { generateId } from "../../etc/helpers";

interface AddPropertySelectProps {
    addProperty: (property: Property) => void
}
export function AddPropertySelect({ addProperty }: AddPropertySelectProps) {

    const options = [
        { value: "text", label: "Text" },
        { value: "checkbox", label: "Checkbox" },
    ]

    return (
        <Select
            className="doNotPan"
            value={null} // So it goes back to "Add property" on select an option 
            placeholder="Add property"
            options={options}
            onChange={(e, meta) => {
                if (e?.value) {
                    addProperty({
                        id: generateId(),
                        abstractPropertyId: "TODO",
                        value: "",
                    })
                }
            }}
        />
    )
}