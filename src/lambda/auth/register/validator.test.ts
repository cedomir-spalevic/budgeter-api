import { GeneralError } from "models/errors";
import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { BudgeterRequest } from "middleware/handler";

let request: BudgeterRequest = {
   auth: {
      isAuthenticated: false
   },
   pathParameters: {},
   queryStrings: {},
   body: {}
}

test("Missing first name", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            lastName: "",
            email: "",
            password: ""
         }
      }
      validate(request);
   }).toThrowError(new GeneralError("firstName is required"));
});

test("Missing last name", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            firstName: "",
            email: "",
            password: ""
         }
      }
      validate(request);
   }).toThrowError(new GeneralError("lastName is required"));
});

test("Missing Password", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            firstName: "Charlie",
            lastName: "Spalevic",
            email: "cedomir.spalevic@gmail.com"
         }
      }
      validate(request);
   }).toThrowError(new GeneralError("password is required"));
});

test("Empty Password", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            firstName: "Charlie",
            lastName: "Spalevic",
            email: "cedomir.spalevic@gmail.com",
            password: ""
         }
      }
      validate(request);
   }).toThrowError(new GeneralError("password is required"));
});

test("Valid request with email", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            firstName: "Charlie",
            lastName: "Spalevic",
            email: "cedomir.spalevic@gmail.com",
            password: "123"
         }
      }
      validate(request);
   }).not.toThrowError();
});

test("Valid request with phone number", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            firstName: "Charlie",
            lastName: "Spalevic",
            phoneNumber: "6309152350",
            password: "123"
         }
      }
      validate(request);
   }).not.toThrowError();
});

test("Missing email or phone number", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            firstName: "Charlie",
            lastName: "Spalevic",
            password: "123"
         }
      }
      validate(request);
   }).toThrowError();
});
