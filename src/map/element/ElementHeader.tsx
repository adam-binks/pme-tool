import { Arrow, Element, getElementType, Node } from "../../app/schema"
import { ArrowOverFlowMenu } from "../arrow/ArrowOverflowMenu"
import { NodeOverFlowMenu } from "../node/NodeOverflowMenu"
import { AddClassSelect } from "../properties/AddClassSelect"
import { ArrowDot } from "./ArrowDot"

export function ElementHeader({
    element,
    showClassSelectIfEmpty = false,
}: {
    element: Element
    showClassSelectIfEmpty?: boolean
}) {
    const elementType = getElementType(element)

    return (
        <div className="flex justify-between">
            {/* <div className="absolute -translate-x-1/2 -translate-y-1/2 z-10"> */}
                <ArrowDot element={element} property={undefined} />
            {/* </div> */}
            {element && (element.classId || showClassSelectIfEmpty) &&
                <AddClassSelect element={element} elementType={elementType} />}

            {/* <Group className={styles.nodeControls} my={-8} position="right" spacing="xs"> */}
            {elementType === "node" && <NodeOverFlowMenu node={element as Node} />}
            {elementType === "arrow" && <ArrowOverFlowMenu arrow={element as Arrow} />}
            {/* </Group> */}
        </div>
    )
}