import { GeneralError } from "models/errors";
import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { Form } from "models/requests";

test("Invalid title", () => {
   expect(() => {
      const form: Form = {
         title: 123,
         amount: 10,
         initialDay: 10,
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(form);
   }).toThrowError(new GeneralError("title must be a string"));
});

test("Required title", () => {
   expect(() => {
      const form: Form = {
         amount: 10,
         initialDay: 10,
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(form);
   }).toThrowError(new GeneralError("title is required"));
});
