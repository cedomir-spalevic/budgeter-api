import { GeneralError } from "models/errors";
import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { Form } from "models/requests";

test("Missing first name", () => {
   expect(() => {
      const form: Form = {
         lastName: "",
         email: "",
         password: "",
         isAdmin: false
      };
      validate(form);
   }).toThrowError(new GeneralError("firstName is required"));
});

test("Missing last name", () => {
   expect(() => {
      const form: Form = {
         firstName: "",
         email: "",
         password: "",
         isAdmin: false
      };
      validate(form);
   }).toThrowError(new GeneralError("lastName is required"));
});

test("Missing Password", () => {
   expect(() => {
      const form: Form = {
         firstName: "Charlie",
         lastName: "Spalevic",
         email: "cedomir.spalevic@gmail.com",
         isAdmin: false
      };
      validate(form);
   }).toThrowError(new GeneralError("password is required"));
});

test("Empty Password", () => {
   expect(() => {
      const form: Form = {
         firstName: "Charlie",
         lastName: "Spalevic",
         email: "cedomir.spalevic@gmail.com",
         password: "",
         isAdmin: false
      };
      validate(form);
   }).toThrowError(new GeneralError("password is required"));
});

test("Valid form with email", () => {
   expect(() => {
      const form: Form = {
         firstName: "Charlie",
         lastName: "Spalevic",
         email: "cedomir.spalevic@gmail.com",
         password: "123",
         isAdmin: false
      };
      validate(form);
   }).not.toThrowError();
});

test("Valid form with phone number", () => {
   expect(() => {
      const form: Form = {
         firstName: "Charlie",
         lastName: "Spalevic",
         phoneNumber: "6309152350",
         password: "123",
         isAdmin: false
      };
      validate(form);
   }).not.toThrowError();
});

test("Missing email or phone number", () => {
   expect(() => {
      const form: Form = {
         firstName: "Charlie",
         lastName: "Spalevic",
         password: "123",
         isAdmin: false
      };
      validate(form);
   }).toThrowError();
});

test("Missing isAdmin", () => {
   expect(() => {
      const form: Form = {
         firstName: "Charlie",
         lastName: "Spalevic",
         password: "123"
      };
      validate(form);
   }).toThrowError();
});
