import { GeneralError } from "models/errors";
import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { Form } from "models/requests";

test("Empty email", () => {
   expect(() => {
      const form: Form = {
         email: null,
         password: "123"
      };
      validate(form);
   }).toThrowError(new GeneralError("email must be a string"));
});

test("Empty phone number", () => {
   expect(() => {
      const form: Form = {
         phoneNumber: null,
         password: "123"
      };
      validate(form);
   }).toThrowError(new GeneralError("phoneNumber must be a string"));
});

test("Empty password", () => {
   expect(() => {
      const form: Form = {
         phoneNumber: "123"
      };
      validate(form);
   }).toThrowError(new GeneralError("password is required"));
});

test("Invalid phone number", () => {
   expect(() => {
      const form: Form = {
         phoneNumber: "123",
         password: "123"
      };
      validate(form);
   }).toThrowError(new GeneralError("Phone number is not valid"));
});

test("Valid form with phone number", () => {
   const form: Form = {
      phoneNumber: "6309152350",
      password: "123"
   };
   const result = validate(form);
   expect(result).not.toBeNull();
});

test("Valid form with email", () => {
   const form: Form = {
      email: "cedomir.spalevic@gmail.com",
      password: "123"
   };
   const result = validate(form);
   expect(result).not.toBeNull();
});
