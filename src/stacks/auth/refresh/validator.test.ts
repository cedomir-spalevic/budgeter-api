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
