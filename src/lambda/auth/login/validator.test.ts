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
};

test("Empty email", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            email: null,
            password: "123"
         }
      };
      validate(request);
   }).toThrowError(new GeneralError("email must be a string"));
});

test("Empty phone number", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            phoneNumber: null,
            password: "123"
         }
      };
      validate(request);
   }).toThrowError(new GeneralError("phoneNumber must be a string"));
});

test("Empty password", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            phoneNumber: "123"
         }
      };
      validate(request);
   }).toThrowError(new GeneralError("password is required"));
});

test("Invalid phone number", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            phoneNumber: "123",
            password: "123"
         }
      };
      validate(request);
   }).toThrowError(new GeneralError("Phone number is not valid"));
});

test("Valid request with phone number", () => {
   request = {
      ...request,
      body: {
         phoneNumber: "6309152350",
         password: "123"
      }
   };
   const result = validate(request);
   expect(result).not.toBeNull();
});

test("Valid request with email", () => {
   request = {
      ...request,
      body: {
         email: "cedomir.spalevic@gmail.com",
         password: "123"
      }
   };
   const result = validate(request);
   expect(result).not.toBeNull();
});
