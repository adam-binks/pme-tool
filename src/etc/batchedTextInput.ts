import { ViewUpdate } from "@codemirror/view";
import React, { useState } from "react";
import { useThrottle } from "use-lodash-debounce-throttle";

export function useBatchedTextInput(
    firebaseValue: string,
    updateFirebaseValue: (newValue: string) => void
) {
    const [local, setLocal] = useState(firebaseValue)
    const [isFocused, setIsFocused] = useState(false)

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

    const throttledUpdateFirebaseValue = useThrottle(updateFirebaseValue, 500)

    return {
        onFocus: () => {
            setIsFocused(true)
            setLocal(firebaseValue)
        },
        onBlur: () => {
            setIsFocused(false)
            if (firebaseValue !== local) updateFirebaseValue(local)
        },
        onChange: (e: React.ChangeEvent<(HTMLInputElement | HTMLTextAreaElement)>) => {
            setLocal(e.target.value)
            throttledUpdateFirebaseValue(e.target.value)
        },
        onChangeValue: (value: string, viewUpdate: ViewUpdate) => {
            setLocal(value)
            throttledUpdateFirebaseValue(value)
        },
        value: isFocused ? local : firebaseValue,
    }
}