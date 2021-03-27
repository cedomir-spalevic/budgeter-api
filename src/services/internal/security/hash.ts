import crypto from "crypto";

/**
 * Generate a SHA256 hash of a value
 * @param value
 */
export const generateHash = (value: string): string =>
   crypto.createHash("sha256").update(value).digest("hex");
