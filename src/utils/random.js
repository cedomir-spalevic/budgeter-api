const crypto = require("crypto");
const uuid = require("uuid");

/**
 * Generates OTC
 * @returns Random 6 digit code
 */
module.exports.generateCode = () =>
   Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Generates Refresh Token, unique key for OTC flow
 * @returns 20 digit random characters
 */
module.exports.generateKey = () => crypto.randomBytes(20).toString("hex");

module.exports.generateGuid = () => uuid.v4();
