import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";
import { BudgeterRequest } from "middleware/handler";

const request: BudgeterRequest = {
   auth: {
      isAuthenticated: false
   },
   pathParameters: {},
   queryStrings: {},
   body: {}
};

test("Empty incomeId", () => {
   expect(() => {
      request.pathParameters = {
         incomeId: ""
      };
      validate(request);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid incomeId", () => {
   expect(() => {
      request.pathParameters = {
         incomeId: "!!!"
      };
      validate(request);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   request.pathParameters = {
      incomeId: objectId
   };
   expect(validate(request).incomeId.toHexString()).toBe(objectId);
});
