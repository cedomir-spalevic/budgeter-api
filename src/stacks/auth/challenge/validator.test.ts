import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { BudgeterRequest } from "models/requests";

let request: BudgeterRequest = {
   auth: {
      isAuthenticated: false,
      isAdmin: false
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
   }).toThrowError();
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
   }).toThrowError();
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
   }).toThrowError();
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
   }).toThrowError();
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
   }).toThrowError();
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
