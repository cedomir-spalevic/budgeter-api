import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { BudgeterRequest } from "models/requests";

let request: BudgeterRequest = {
   auth: {
      isAuthenticated: false
   },
   pathParameters: {},
   queryStrings: {},
   body: {}
};

test("Invalid refresh token", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            refreshToken: null
         }
      };
      validate(request);
   }).toThrowError();
});
