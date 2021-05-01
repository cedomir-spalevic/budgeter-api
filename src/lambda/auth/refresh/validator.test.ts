import { GeneralError } from "models/errors";
import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { Form } from "models/requests";

test("Invalid refresh token", () => {
   expect(() => {
      const form: Form = {
         refreshToken: null
      };
      validate(form);
   }).toThrowError(new GeneralError("refreshToken must be a string"));
});
