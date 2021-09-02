import { expect, test } from "@jest/globals";
import { GeneralError } from "models/errors";
import { BudgeterRequest } from "models/requests";
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

test("Empty userId", () => {
   expect(() => {
      request.pathParameters = {
         userId: ""
      };
      validate(request);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid userId", () => {
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

test("Empty Password", () => {
   expect(() => {
      request.body = {
         firstName: "Charlie",
         lastName: "Spalevic",
         email: "cedomir.spalevic@gmail.com",
         password: "",
         isAdmin: false
      };
      validate(request);
   }).toThrowError(new GeneralError("password is required"));
});

test("Valid form with email", () => {
   expect(() => {
      request.body = {
         firstName: "Charlie",
         lastName: "Spalevic",
         password: "123",
         isAdmin: false
      };
      validate(request);
   }).not.toThrowError();
});

test("Invalid isAdmin", () => {
   expect(() => {
      request.body = {
         isAdmin: "false"
      };
      validate(request);
   }).toThrowError();
});

test("Password is blank", () => {
   expect(() => {
      request.body = {
         password: ""
      };
      validate(request);
   }).toThrowError();
});

test("Missing isAdmin", () => {
   expect(() => {
      request.body = {
         firstName: "Charlie",
         lastName: "Spalevic",
         password: "123"
      };
      validate(request);
   }).not.toThrowError();
});
