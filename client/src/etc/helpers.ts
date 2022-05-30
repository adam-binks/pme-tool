import { customAlphabet } from "nanoid";

// to comply with Mongoose ObjectId requirements (hex, 24 chars long)
export const generate_id = customAlphabet('1234567890abcdef', 24)