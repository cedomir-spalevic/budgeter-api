import { generateOneTimeCode, isOneTimeCode } from "lib/security/oneTimeCode";
import { EMAIL_USER_IDENTIFIER_TYPE } from "../../../utils/constants";

let req;

describe("One Time Code tests", () => {
   beforeEach(() => {
      req = {
         body: {},
         logger: {
            info: jest.fn(),
            error: jest.fn()
         }
      };
   });

   test("One Time Code is 6 digits", () => {
      const oneTimeCode = generateOneTimeCode(req, "");
      expect(oneTimeCode.code).toBeTruthy();
      expect(oneTimeCode.code.toString().length).toBe(6);
   });

   test("Non valid one time code", () => {
      expect(isOneTimeCode(123)).toBeFalsy();
   });

   test("Non valid one time code", () => {
      expect(isOneTimeCode()).toBeFalsy();
   });

   test("Non valid one time code", () => {
      expect(isOneTimeCode(12345)).toBeFalsy();
   });

   test("Non valid one time code", () => {
      expect(isOneTimeCode(1234567)).toBeFalsy();
   });

   test("Non valid one time code", () => {
      expect(isOneTimeCode("12345")).toBeFalsy();
   });

   test("Non valid one time code", () => {
      expect(isOneTimeCode("12A456")).toBeFalsy();
   });

   test("Non valid one time code", () => {
      expect(isOneTimeCode("1234567")).toBeFalsy();
   });

   test("Valid one time code", () => {
      expect(isOneTimeCode("123456")).toBeTruthy();
   });

   test("Valid one time code", () => {
      expect(isOneTimeCode(123456)).toBeTruthy();
   });

   test("Generated one time code has all of the required properties", () => {
      const otc = generateOneTimeCode(req, "cedomir.spalevic@gmail.com", EMAIL_USER_IDENTIFIER_TYPE);
      expect(otc).toHaveProperty("code");
      expect(otc).toHaveProperty("key");
      expect(otc).toHaveProperty("userIdentifier");
      expect(otc).toHaveProperty("type");
      expect(otc).toHaveProperty("expiresOn");
   });
});