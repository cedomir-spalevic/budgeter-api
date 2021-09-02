import { expect, test } from "@jest/globals";
import { GeneralError } from "models/errors";
import { BudgeterRequest } from "models/requests";
import { ObjectId } from "mongodb";
import { validate } from "./validateDelete";

const request: BudgeterRequest = {
   auth: {
      isAuthenticated: false
   },
   pathParameters: {},
   queryStrings: null,
   body: {}
};

test("Empty userId", () => {
   expect(() => {
      request.pathParameters = {
         userId: ""
      };
      validate(request);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid apiKeyId", () => {
   expect(() => {
      request.pathParameters = {
         userId: "!!!"
      };
      validate(request);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   request.pathParameters = {
      userId: objectId
   };
   expect(validate(request).userId.toHexString()).toBe(objectId);
});
