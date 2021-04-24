import { GeneralError } from "models/errors";
import { test, expect } from "@jest/globals";
import { validateEmailOrPhoneNumber } from "./emailOrPhoneNumber";

test("Missing email and phone number", () => {
   expect(() => {
      validateEmailOrPhoneNumber({});
   }).toThrowError(
      new GeneralError("An email or phone number must be provided")
   );
});

test("Null email", () => {
   expect(() => {
      validateEmailOrPhoneNumber({ email: null });
   }).toThrowError(
      new GeneralError("An email or phone number must be provided")
   );
});

test("Invalid email", () => {
   expect(() => {
      validateEmailOrPhoneNumber({ email: "charlie.gmail.com" });
   }).toThrowError(new GeneralError("Email is not valid"));
});

test("Null email but valid phone number", () => {
   expect(() => {
      validateEmailOrPhoneNumber({ email: null, phoneNumber: "6309152350" });
   }).not.toThrowError();
});

test("Blank email and phone number", () => {
   expect(() => {
      validateEmailOrPhoneNumber({ email: "", phoneNumber: "" });
   }).toThrowError(
      new GeneralError("An email or phone number must be provided")
   );
});

test("Valid email but blank phone number", () => {
   const result = validateEmailOrPhoneNumber({
      email: "charlie.spalevic@gmail.com",
      phoneNumber: null
   });
   expect(result.email).toBe("charlie.spalevic@gmail.com");
   expect(result.phoneNumber).toBe(null);
});

test("Valid email but blank phone number", () => {
   const result = validateEmailOrPhoneNumber({
      email: "charlie.spalevic@gmail.com",
      phoneNumber: ""
   });
   expect(result.email).toBe("charlie.spalevic@gmail.com");
   expect(result.phoneNumber).toBe(null);
});

test("Valid email but blank phone number", () => {
   const result = validateEmailOrPhoneNumber({
      email: "charlie.spalevic@gmail.com"
   });
   expect(result.email).toBe("charlie.spalevic@gmail.com");
   expect(result.phoneNumber).toBe(null);
});

test("Valid phone number but blank email", () => {
   const result = validateEmailOrPhoneNumber({ phoneNumber: "6309152350" });
   expect(result.phoneNumber).toBe("+1630 915 2350");
   expect(result.email).toBe(null);
});

test("Valid phone number but blank email", () => {
   const result = validateEmailOrPhoneNumber({
      phoneNumber: "6309152350",
      email: null
   });
   expect(result.phoneNumber).toBe("+1630 915 2350");
   expect(result.email).toBe(null);
});

test("Valid phone number but blank email", () => {
   const result = validateEmailOrPhoneNumber({
      phoneNumber: "6309152350",
      email: ""
   });
   expect(result.phoneNumber).toBe("+1630 915 2350");
   expect(result.email).toBe(null);
});
