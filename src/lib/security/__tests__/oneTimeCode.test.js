const {
   generateOneTimeCode,
   isOneTimeCode
} = require("lib/security/oneTimeCode");
const { EMAIL_USER_IDENTIFIER_TYPE } = require("utils/constants");

let req;

describe("one time code tests", () => {
   beforeEach(() => {
      req = {
         body: {},
         logger: {
            info: jest.fn(),
            error: jest.fn()
         }
      };
   });

   test("one time code is 6 digits", () => {
      const oneTimeCode = generateOneTimeCode(req, "");
      expect(oneTimeCode.code).toBeTruthy();
      expect(oneTimeCode.code.toString().length).toBe(6);
   });

   test("invalid one time code", () => {
      expect(isOneTimeCode(123)).toBeFalsy();
   });

   test("invalid one time code", () => {
      expect(isOneTimeCode()).toBeFalsy();
   });

   test("invalid one time code", () => {
      expect(isOneTimeCode(12345)).toBeFalsy();
   });

   test("invalid one time code", () => {
      expect(isOneTimeCode(1234567)).toBeFalsy();
   });

   test("invalid one time code", () => {
      expect(isOneTimeCode("12345")).toBeFalsy();
   });

   test("invalid one time code", () => {
      expect(isOneTimeCode("12A456")).toBeFalsy();
   });

   test("invalid one time code", () => {
      expect(isOneTimeCode("1234567")).toBeFalsy();
   });

   test("valid one time code", () => {
      expect(isOneTimeCode("123456")).toBeTruthy();
   });

   test("valid one time code", () => {
      expect(isOneTimeCode(123456)).toBeTruthy();
   });

   test("generated one time code has all of the required properties", () => {
      const otc = generateOneTimeCode(
         req,
         "cedomir.spalevic@gmail.com",
         EMAIL_USER_IDENTIFIER_TYPE
      );
      expect(otc).toHaveProperty("code");
      expect(otc).toHaveProperty("key");
      expect(otc).toHaveProperty("userIdentifier");
      expect(otc).toHaveProperty("userIdentifierType");
      expect(otc).toHaveProperty("expires");
   });
});
