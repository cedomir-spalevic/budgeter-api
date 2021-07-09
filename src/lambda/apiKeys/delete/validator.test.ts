import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";
import { BudgeterRequest } from "middleware/handler";

let request: BudgeterRequest = {
   auth: {
      isAuthenticated: false
   },
   pathParameters: {},
   queryStrings: {},
   body: {}
}

test("Empty apiKeyId", () => {
   expect(() => {
      request = {
         ...request,
         pathParameters: {
            apiKeyId: ""
         }
      }
      validate(request);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid apiKeyId", () => {
   expect(() => {
      request = {
         ...request,
         pathParameters: {
            apiKeyId: "!!!"
         }
      }
      validate(request);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   request = {
      ...request,
      pathParameters: {
         apiKeyId: objectId
      }
   }
   expect(validate(request).toHexString()).toBe(objectId);
});
