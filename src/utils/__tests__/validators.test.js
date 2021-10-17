import { isEmail, isPhoneNumber } from "../validators.js";

describe("Email validation", () => {
   test("Invalid email", () => {
      expect(isEmail("123")).toBeFalsy();
   });
   
   test("Invalid email", () => {
      expect(isEmail("charlie.spalevic.com")).toBeFalsy();
   });
   
   test("Invalid email", () => {
      expect(isEmail("@gmail.com")).toBeFalsy();
   });
   
   test("Valid email", () => {
      expect(isEmail("cedomir.spalevic@gmail.com")).toBeTruthy();
   });
   
   test("Valid email", () => {
      expect(isEmail("cedomir.spalevic@gmail.net")).toBeTruthy();
   });
   
   test("Valid email", () => {
      expect(isEmail("cedomir@gmail.com")).toBeTruthy();
   });
});

describe("Phone number validation", () => {
   test("Invalid phone number", () => {
      expect(isPhoneNumber("123")).toBeFalsy();
   });
   
   test("Invalid phone number", () => {
      expect(isPhoneNumber("asdbasdf")).toBeFalsy();
   });
   
   test("Invalid phone number", () => {
      expect(isPhoneNumber("1111111111111111111111")).toBeFalsy();
   });
   
   test("Invalid phone number", () => {
      expect(isPhoneNumber("0909090909090909090")).toBeFalsy();
   });
   
   test("Invalid phone number", () => {
      expect(isPhoneNumber("---------")).toBeFalsy();
   });
   
   test("Valid phone number", () => {
      expect(isPhoneNumber("6309152350")).toBeTruthy();
   });
   
   test("Valid phone number", () => {
      expect(isPhoneNumber("(630)915-2350")).toBeTruthy();
   });
   
   test("Valid phone number", () => {
      expect(isPhoneNumber("630-915-2350")).toBeTruthy();
   });
});