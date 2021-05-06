import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { APIGatewayProxyEventPathParameters } from "aws-lambda";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";

test("Empty incomeId", () => {
   expect(() => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
         incomeId: ""
      };
      validate(pathParameters);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid incomeId", () => {
   expect(() => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
         incomeId: "!!!"
      };
      validate(pathParameters);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   const pathParameters: APIGatewayProxyEventPathParameters = {
      incomeId: objectId
   };
   expect(validate(pathParameters).toHexString()).toBe(objectId);
});
