import { expect, test } from "@jest/globals";
import { GeneralError } from "models/errors";
import { BudgeterRequest } from "models/requests";
import { validate } from "./validateCreate";

const request: BudgeterRequest = {
   auth: {
      isAuthenticated: false,
      isAdmin: false
   },
   pathParameters: {},
   queryStrings: null,
   body: {}
};

test("Missing first name", () => {
   expect(() => {
      request.body = {
         lastName: "",
         email: "",
         password: "",
         isAdmin: false
      };
      validate(request);
   }).toThrowError(new GeneralError("firstName is required"));
});

test("Missing last name", () => {
   expect(() => {
      request.body = {
         firstName: "",
         email: "",
         password: "",
         isAdmin: false
      };
      validate(request);
   }).toThrowError(new GeneralError("lastName is required"));
});

test("Missing Password", () => {
   expect(() => {
      request.body = {
         firstName: "Charlie",
         lastName: "Spalevic",
         email: "cedomir.spalevic@gmail.com",
         isAdmin: false
      };
      validate(request);
   }).toThrowError(new GeneralError("password is required"));
});

test("Empty Password", () => {
   expect(() => {
      request.body = {
         firstName: "Charlie",
         lastName: "Spalevic",
         email: "cedomir.spalevic@gmail.com",
         password: "",
         isAdmin: false
      };
      validate(request);
   }).toThrowError(new GeneralError("password is required"));
});

test("Valid form with email", () => {
   expect(() => {
      request.body = {
         firstName: "Charlie",
         lastName: "Spalevic",
         email: "cedomir.spalevic@gmail.com",
         password: "123",
         isAdmin: false
      };
      validate(request);
   }).not.toThrowError();
});

test("Valid form with phone number", () => {
   expect(() => {
      request.body = {
         firstName: "Charlie",
         lastName: "Spalevic",
         phoneNumber: "6309152350",
         password: "123",
         isAdmin: false
      };
      validate(request);
   }).not.toThrowError();
});

test("Missing email or phone number", () => {
   expect(() => {
      request.body = {
         firstName: "Charlie",
         lastName: "Spalevic",
         password: "123",
         isAdmin: false
      };
      validate(request);
   }).toThrowError();
});

test("Missing isAdmin", () => {
   expect(() => {
      request.body = {
         firstName: "Charlie",
         lastName: "Spalevic",
         password: "123"
      };
      validate(request);
   }).toThrowError();
});
