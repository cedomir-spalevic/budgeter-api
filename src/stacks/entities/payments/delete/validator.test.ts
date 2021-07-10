import { expect, test } from "@jest/globals";
import { BudgeterRequest } from "middleware/handler";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";
import { validate } from "./validator";

const request: BudgeterRequest = {
   auth: {
      isAuthenticated: false
   },
   pathParameters: {},
   queryStrings: null,
   body: {}
};

test("Empty paymentId", () => {
   expect(() => {
      request.pathParameters = {
         paymentId: ""
      };
      validate(request);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid paymentId", () => {
   expect(() => {
      request.pathParameters = {
         paymentId: "!!!"
      };
      validate(request);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   request.pathParameters = {
      paymentId: objectId
   };
   expect(validate(request).paymentId.toHexString()).toBe(objectId);
});
