import { isEmail } from "lib/email";

describe("email validation", () => {
   test("invalid email", () => {
      expect(isEmail("123")).toBeFalsy();
   });
   
   test("invalid email", () => {
      expect(isEmail("charlie.spalevic.com")).toBeFalsy();
   });
   
   test("invalid email", () => {
      expect(isEmail("@gmail.com")).toBeFalsy();
   });
   
   test("valid email", () => {
      expect(isEmail("cedomir.spalevic@gmail.com")).toBeTruthy();
   });
   
   test("valid email", () => {
      expect(isEmail("cedomir.spalevic@gmail.net")).toBeTruthy();
   });
   
   test("valid email", () => {
      expect(isEmail("cedomir@gmail.com")).toBeTruthy();
   });
});