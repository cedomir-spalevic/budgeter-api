import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { GeneralError } from "models/errors";

test("Null query strings", () => {
   expect(() => {
      validate(null);
   }).toThrowError();
});

test("No date query string", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         month: "1",
         year: "2021"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("date is required"));
});

test("No month query string", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "1",
         year: "2021"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("month is required"));
});

test("No year query string", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "1",
         month: "1"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("year is required"));
});

test("Date not within range", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "-1",
         month: "1",
         year: "1"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("date must be between 1 and 31"));
});

test("Date not within range", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "0",
         month: "1",
         year: "1"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("date must be between 1 and 31"));
});

test("Date not within range", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "32",
         month: "1",
         year: "1"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("date must be between 1 and 31"));
});

test("Date is not a number", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "a",
         month: "1",
         year: "1995"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("date must be a number"));
});

test("Month not within range", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "1",
         month: "-1",
         year: "1995"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("month must be between 0 and 11"));
});

test("Month not within range", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "1",
         month: "12",
         year: "1995"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("month must be between 0 and 11"));
});

test("Month not a number", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "1",
         month: "a",
         year: "1995"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("month must be a number"));
});

test("Year is not a number", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "15",
         month: "7",
         year: "a"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("year must be a number"));
});

test("Year is not valid", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "15",
         month: "7",
         year: "-1"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("year is not valid"));
});

test("Year is not valid", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "15",
         month: "7",
         year: "123"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("year is not valid"));
});

test("Year is not valid", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "15",
         month: "7",
         year: "12345"
      };
      validate(queryStringParameters);
   }).toThrowError(new GeneralError("year is not valid"));
});

test("Valid query strings", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "15",
         month: "7",
         year: "1995"
      };
      validate(queryStringParameters);
   }).not.toThrowError();
});

test("Valid query strings", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "1",
         month: "0",
         year: "1995"
      };
      validate(queryStringParameters);
   }).not.toThrowError();
});

test("Valid query strings", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "31",
         month: "0",
         year: "1995"
      };
      validate(queryStringParameters);
   }).not.toThrowError();
});

test("Valid query strings", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "31",
         month: "11",
         year: "1995"
      };
      validate(queryStringParameters);
   }).not.toThrowError();
});

test("Valid query strings", () => {
   expect(() => {
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {
         date: "1",
         month: "11",
         year: "1995"
      };
      validate(queryStringParameters);
   }).not.toThrowError();
});
