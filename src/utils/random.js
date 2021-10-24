import crypto from "crypto";

/**
 * Generates OTC
 * @returns Random 6 digit code
 */
export const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Generates Refresh Token, unique key for OTC flow
 * @returns 20 digit random characters
 */
export const generateKey = () => crypto.randomBytes(20).toString("hex");