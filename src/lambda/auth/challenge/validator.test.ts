import { GeneralError } from "models/errors";
import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { Form } from "models/requests";

test("Empty email", () => {
   expect(() => {
      const form: Form = {
         email: null,
         type: "userVerification"
      };
      validate(form);
   }).toThrowError(new GeneralError("email must be a string"));
});

test("Empty phone number", () => {
   expect(() => {
      const form: Form = {
         phoneNumber: null,
         type: "userVerification"
      };
      validate(form);
   }).toThrowError(new GeneralError("phoneNumber must be a string"));
});

test("Invalid phone number", () => {
   expect(() => {
      const form: Form = {
         phoneNumber: "123",
         type: "userVerification"
      };
      validate(form);
   }).toThrowError(new GeneralError("Phone number is not valid"));
});

test("userVerification type", () => {
   expect(() => {
      const form: Form = {
         email: "cedomir.spalevic@gmail.com",
         type: "userVerification"
      };
      return validate(form);
   }).not.toBeNull();
});

test("passwordReset type", () => {
   expect(() => {
      const form: Form = {
         email: "cedomir.spalevic@gmail.com",
         type: "passwordReset"
      };
      return validate(form);
   }).not.toBeNull();
});

test("incorrect type", () => {
   expect(() => {
      const form: Form = {
         phoneNumber: "123",
         type: "test"
      };
      validate(form);
   }).toThrowError(GeneralError);
});

test("missing type", () => {
   expect(() => {
      const form: Form = {
         phoneNumber: ""
      };
      validate(form);
   }).toThrowError(new GeneralError("type is required"));
});

test("email and phone number", () => {
   expect(() => {
      const form: Form = {
         email: "cedomir.spalevic@gmail.com",
         phoneNumber: null,
         type: "userVerification"
      };
      return validate(form);
   }).not.toBeNull();
});
