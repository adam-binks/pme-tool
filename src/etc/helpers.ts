import { isEqual } from "lodash";
import { customAlphabet } from "nanoid";
import { useState } from "react";

// to comply with Mongoose ObjectId requirements (hex, 24 chars long)
export const generateId = customAlphabet('1234567890abcdef', 24)

export function last<x>(arr: x[]) {
    return arr && arr[arr.length - 1]
}

export function forceCast<T>(input: any): T {
    // @ts-ignore
    return input
}

export function deepcopy<T>(input: T) : T {
    return JSON.parse(JSON.stringify(input))
}

export function truthyLog(...args: any[]) {
    console.log(...args)
    return true
}

export const useMemoisedState = <T>(initialValue: T): [T, (val: T) => void] => {
    const [state, _setState] = useState<T>(initialValue)
  
    const setState = (newState: T) => {
      _setState((prev) => {
        if (!isEqual(newState, prev)) {
          return newState
        } else {
          return prev
        }
      })
    }
  
    return [state, setState]
  }