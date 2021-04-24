import { GeneralError } from "models/errors";
import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { Form } from "models/requests";

test("Invalid key", () => {
   expect(() => {
      const form: Form = {
         code: 123456
      };
      validate("", form);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Missing code", () => {
   expect(() => {
      const form: Form = {};
      validate("534fe04e-b3f5-4b54-bab5-16315d6d0f0a", form);
   }).toThrowError(new GeneralError("code is required"));
});

test("Invalid code", () => {
   expect(() => {
      const form: Form = {
         code: null
      };
      validate("534fe04e-b3f5-4b54-bab5-16315d6d0f0a", form);
   }).toThrowError(new GeneralError("code must be a number"));
});

test("Valid form", () => {
   expect(() => {
      const form: Form = {
         code: 123456
      };
      return validate("534fe04e-b3f5-4b54-bab5-16315d6d0f0a", form);
   }).not.toBeNull();
});
