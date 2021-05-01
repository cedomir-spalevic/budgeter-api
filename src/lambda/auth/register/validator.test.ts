import { GeneralError } from "models/errors";
import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { Form } from "models/requests";

test("Missing first name", () => {
   expect(() => {
      const form: Form = {
         lastName: "",
         email: "",
         password: ""
      };
      validate(form);
   }).toThrowError(new GeneralError("firstName is required"));
});

test("Missing last name", () => {
   expect(() => {
      const form: Form = {
         firstName: "",
         email: "",
         password: ""
      };
      validate(form);
   }).toThrowError(new GeneralError("lastName is required"));
});
