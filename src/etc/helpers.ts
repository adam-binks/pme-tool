import { customAlphabet } from "nanoid";

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