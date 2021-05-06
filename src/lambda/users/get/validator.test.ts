import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import {
   APIGatewayProxyEventPathParameters,
   APIGatewayProxyEventQueryStringParameters
} from "aws-lambda";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";

test("Empty userId", () => {
   expect(() => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
         userId: ""
      };
      validate({ pathParameters, queryStrings: null });
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid userId", () => {
   expect(() => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
         userId: "!!!"
      };
      validate({ pathParameters, queryStrings: null });
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   const pathParameters: APIGatewayProxyEventPathParameters = {
      userId: objectId
   };
   expect(
      validate({
         pathParameters,
         queryStrings: null
      }).pathParameters.userId.toHexString()
   ).toBe(objectId);
});

test("Null query strings", () => {
   const result = validate({ pathParameters: null, queryStrings: null });
   expect(result.queryStrings.limit).toBe(5);
   expect(result.queryStrings.skip).toBe(0);
});

test("Invalid limit", () => {
   expect(() => {
      const queryStrings: APIGatewayProxyEventQueryStringParameters = {
         limit: "-1"
      };
      validate({ pathParameters: null, queryStrings });
   }).toThrowError();
});

test("Invalid limit", () => {
   expect(() => {
      const queryStrings: APIGatewayProxyEventQueryStringParameters = {
         limit: "a"
      };
      validate({ pathParameters: null, queryStrings });
   }).toThrowError();
});

test("Invalid limit", () => {
   expect(() => {
      const queryStrings: APIGatewayProxyEventQueryStringParameters = {
         limit: "null"
      };
      validate({ pathParameters: null, queryStrings });
   }).toThrowError();
});

test("Valid limit", () => {
   const queryStrings: APIGatewayProxyEventQueryStringParameters = {
      limit: "7"
   };
   const result = validate({ pathParameters: null, queryStrings });
   expect(result.queryStrings.limit).toBe(7);
   expect(result.queryStrings.skip).toBe(0);
});

test("Invalid skip", () => {
   expect(() => {
      const queryStrings: APIGatewayProxyEventQueryStringParameters = {
         skip: "-1"
      };
      validate({ pathParameters: null, queryStrings });
   }).toThrowError();
});

test("Invalid skip", () => {
   expect(() => {
      const queryStrings: APIGatewayProxyEventQueryStringParameters = {
         skip: "a"
      };
      validate({ pathParameters: null, queryStrings });
   }).toThrowError();
});

test("Invalid skip", () => {
   expect(() => {
      const queryStrings: APIGatewayProxyEventQueryStringParameters = {
         skip: "null"
      };
      validate({ pathParameters: null, queryStrings });
   }).toThrowError();
});

test("Valid skip", () => {
   const queryStrings: APIGatewayProxyEventQueryStringParameters = {
      skip: "7"
   };
   const result = validate({ pathParameters: null, queryStrings });
   expect(result.queryStrings.limit).toBe(5);
   expect(result.queryStrings.skip).toBe(7);
});

test("Valid query strings", () => {
   const queryStrings: APIGatewayProxyEventQueryStringParameters = {
      limit: "10",
      skip: "5"
   };
   const result = validate({ pathParameters: null, queryStrings });
   expect(result.queryStrings.limit).toBe(10);
   expect(result.queryStrings.skip).toBe(5);
});

test("Valid query strings with", () => {
   const queryStrings: APIGatewayProxyEventQueryStringParameters = {
      limit: "10",
      skip: "5",
      search: "Test"
   };
   const result = validate({ pathParameters: null, queryStrings });
   expect(result.queryStrings.limit).toBe(10);
   expect(result.queryStrings.skip).toBe(5);
   expect(result.queryStrings.search).toBe("Test");
});
