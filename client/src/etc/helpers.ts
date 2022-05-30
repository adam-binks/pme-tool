import { customAlphabet } from "nanoid";

// to comply with Mongoose ObjectId requirements (hex, 24 chars long)
export const generateId = customAlphabet('1234567890abcdef', 24)