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
            type: "userVerification"
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
            type: "userVerification"
         }
      };
      validate(request);
   }).toThrowError(new GeneralError("phoneNumber must be a string"));
});

test("Invalid phone number", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            phoneNumber: "123",
            type: "userVerification"
         }
      };
      validate(request);
   }).toThrowError(new GeneralError("Phone number is not valid"));
});

test("userVerification type", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            email: "cedomir.spalevic@gmail.com",
            type: "userVerification"
         }
      };
      return validate(request);
   }).not.toBeNull();
});

test("passwordReset type", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            email: "cedomir.spalevic@gmail.com",
            type: "passwordReset"
         }
      };
      return validate(request);
   }).not.toBeNull();
});

test("incorrect type", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            phoneNumber: "123",
            type: "test"
         }
      };
      validate(request);
   }).toThrowError(GeneralError);
});

test("missing type", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            phoneNumber: ""
         }
      };
      validate(request);
   }).toThrowError(new GeneralError("type is required"));
});

test("email and phone number", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            email: "cedomir.spalevic@gmail.com",
            phoneNumber: null,
            type: "userVerification"
         }
      };
      return validate(request);
   }).not.toBeNull();
});
