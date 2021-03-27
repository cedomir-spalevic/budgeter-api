import crypto from "crypto";

export const getRandomKey = (): string =>
   crypto.randomBytes(20).toString("hex");
