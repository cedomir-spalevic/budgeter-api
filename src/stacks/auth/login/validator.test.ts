import { validate } from "./validator";
import { test, expect } from "@jest/globals";
import { BudgeterRequest } from "models/requests";

let request: BudgeterRequest = {
   auth: {
      isAuthenticated: false
   },
   pathParameters: {},
   queryStrings: {},
   body: {}
};

test("Empty email", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            email: null,
            password: "123"
         }
      };
      validate(request);
   }).toThrowError();
});

test("Empty phone number", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            phoneNumber: null,
            password: "123"
         }
      };
      validate(request);
   }).toThrowError();
});

test("Empty password", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            phoneNumber: "123"
         }
      };
      validate(request);
   }).toThrowError();
});

test("Invalid phone number", () => {
   expect(() => {
      request = {
         ...request,
         body: {
            phoneNumber: "123",
            password: "123"
         }
      };
      validate(request);
   }).toThrowError();
});

test("Valid request with phone number", () => {
   request = {
      ...request,
      body: {
         phoneNumber: "(630)915-2350",
         password: "123"
      }
   };
   const result = validate(request);
   expect(result).not.toBeNull();
});

test("Valid request with email", () => {
   request = {
      ...request,
      body: {
         email: "cedomir.spalevic@gmail.com",
         password: "123"
      }
   };
   const result = validate(request);
   expect(result).not.toBeNull();
});
