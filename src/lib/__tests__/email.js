import { isEmail } from "lib/email";

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