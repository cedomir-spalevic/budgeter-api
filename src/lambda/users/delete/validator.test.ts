import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { APIGatewayProxyEventPathParameters } from "aws-lambda";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";

test("Empty userId", () => {
   expect(() => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
         userId: ""
      };
      validate(pathParameters);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid apiKeyId", () => {
   expect(() => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
         userId: "!!!"
      };
      validate(pathParameters);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   const pathParameters: APIGatewayProxyEventPathParameters = {
      userId: objectId
   };
   expect(validate(pathParameters).toHexString()).toBe(objectId);
});
