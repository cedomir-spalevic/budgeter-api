import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { APIGatewayProxyEventPathParameters } from "aws-lambda";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";

test("Empty paymentId", () => {
   expect(() => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
         paymentId: ""
      };
      validate(pathParameters);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid paymentId", () => {
   expect(() => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
         paymentId: "!!!"
      };
      validate(pathParameters);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   const pathParameters: APIGatewayProxyEventPathParameters = {
      paymentId: objectId
   };
   expect(validate(pathParameters).toHexString()).toBe(objectId);
});
