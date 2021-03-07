import crypto from "crypto";

export const getRandomKey = () => crypto.randomBytes(20).toString("hex");