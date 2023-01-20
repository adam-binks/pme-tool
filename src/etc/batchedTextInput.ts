import { ViewUpdate } from "@codemirror/view";
import React, { useState } from "react";
import { useThrottle } from "use-lodash-debounce-throttle";

export function useBatchedTextInput(
    firebaseValue: string,
    updateFirebaseValue: (newValue: string) => void,
    periodicSync: boolean = true,
) {
    const [local, setLocal] = useState(firebaseValue)
    const [lastFocused, setLastFocused] = useState<"current" | Date | undefined>(undefined)

    // TODO - update local from firebase if not edited for x seconds
    // I think this method should work, not certain why it's not

    // const [firebaseAndLocalMatchSinceChange, setFirebaseAndLocalMatchSinceChange] = useState(false)
    // if (isFocused && !firebaseAndLocalMatchSinceChange && firebaseValue === local) {
    //     setFirebaseAndLocalMatchSinceChange(true)
    // }

    // const pullFromFirebase = () => {
    //     if (isFocused && firebaseAndLocalMatchSinceChange && firebaseValue !== local) {
    //         setLocal(firebaseValue)
    //     }
    //     console.log("pull!")
    //     debouncedPullFromFirebase()
    // }
    // const debouncedPullFromFirebase = useDebounce(pullFromFirebase, 1000)

    const throttledUpdateFirebaseValue = useThrottle(updateFirebaseValue, 2000)

    return {
        onFocus: () => {
            setLastFocused("current")
            setLocal(firebaseValue)
        },
        onBlur: () => {
            setLastFocused(new Date())
            if (firebaseValue !== local) {
                updateFirebaseValue(local)
            }
        },
        onChange: (e: React.ChangeEvent<(HTMLInputElement | HTMLTextAreaElement)>) => {
            setLocal(e.target.value)
            periodicSync && throttledUpdateFirebaseValue(e.target.value)
        },
        onChangeValue: (value: string, viewUpdate: ViewUpdate) => {
            setLocal(value)
            periodicSync && throttledUpdateFirebaseValue(value)
    },
        value: (
            lastFocused !== undefined &&
            (
                lastFocused === "current"
                // show local if it's been less than a second since element was focused
                // because otherwise the firebase value overwrites the local value if connection is slow
                || (new Date().getTime() - (lastFocused as Date).getTime() < 1500)
            )
        ) ? local : firebaseValue,
    }
}