const { isPhoneNumber } = require("lib/phoneNumber");

describe("phone number validation", () => {
   test("invalid phone number", () => {
      expect(isPhoneNumber("123")).toBeFalsy();
   });
   
   test("invalid phone number", () => {
      expect(isPhoneNumber("asdbasdf")).toBeFalsy();
   });
   
   test("invalid phone number", () => {
      expect(isPhoneNumber("1111111111111111111111")).toBeFalsy();
   });
   
   test("invalid phone number", () => {
      expect(isPhoneNumber("0909090909090909090")).toBeFalsy();
   });
   
   test("invalid phone number", () => {
      expect(isPhoneNumber("---------")).toBeFalsy();
   });
   
   test("valid phone number", () => {
      expect(isPhoneNumber("6309152350")).toBeTruthy();
   });
   
   test("valid phone number", () => {
      expect(isPhoneNumber("(630)915-2350")).toBeTruthy();
   });
   
   test("valid phone number", () => {
      expect(isPhoneNumber("630-915-2350")).toBeTruthy();
   });
});