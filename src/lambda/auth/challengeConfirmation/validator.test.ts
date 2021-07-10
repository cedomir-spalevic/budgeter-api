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

test("Invalid key", () => {
   expect(() => {
      request = {
         ...request,
         pathParameters: {
            key: ""
         },
         body: {
            code: 123456
         }
      };
      validate(request);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Missing code", () => {
   expect(() => {
      request = {
         ...request,
         pathParameters: {
            key: "534fe04e-b3f5-4b54-bab5-16315d6d0f0a"
         },
         body: {}
      };
      validate(request);
   }).toThrowError(new GeneralError("code is required"));
});

test("Invalid code", () => {
   expect(() => {
      request = {
         ...request,
         pathParameters: {
            key: "534fe04e-b3f5-4b54-bab5-16315d6d0f0a"
         },
         body: {
            code: null
         }
      };
      validate(request);
   }).toThrowError(new GeneralError("code must be a number"));
});

test("Valid form", () => {
   expect(() => {
      request = {
         ...request,
         pathParameters: {
            key: "534fe04e-b3f5-4b54-bab5-16315d6d0f0a"
         },
         body: {
            code: 123456
         }
      };
      return validate(request);
   }).not.toBeNull();
});
