import { GeneralError } from "models/errors";
import { validateForm, validatePathParameter } from "./validator";
import { test, expect } from "@jest/globals";
import { Form } from "models/requests";
import { ObjectId } from "mongodb";
import { APIGatewayProxyEventPathParameters } from "aws-lambda";

test("Empty userId", () => {
   expect(() => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
         userId: ""
      };
      validatePathParameter(pathParameters);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid userId", () => {
   expect(() => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
         userId: "!!!"
      };
      validatePathParameter(pathParameters);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   const pathParameters: APIGatewayProxyEventPathParameters = {
      userId: objectId
   };
   expect(validatePathParameter(pathParameters).toHexString()).toBe(objectId);
});

test("Empty Password", () => {
   expect(() => {
      const form: Form = {
         firstName: "Charlie",
         lastName: "Spalevic",
         email: "cedomir.spalevic@gmail.com",
         password: "",
         isAdmin: false
      };
      validateForm(form);
   }).toThrowError(new GeneralError("password is required"));
});

test("Valid form with email", () => {
   expect(() => {
      const form: Form = {
         firstName: "Charlie",
         lastName: "Spalevic",
         password: "123",
         isAdmin: false
      };
      validateForm(form);
   }).not.toThrowError();
});

test("Invalid isAdmin", () => {
   expect(() => {
      const form: Form = {
         isAdmin: "false"
      };
      validateForm(form);
   }).toThrowError();
});

test("Password is blank", () => {
   expect(() => {
      const form: Form = {
         password: ""
      };
      validateForm(form);
   }).toThrowError();
});

test("Missing isAdmin", () => {
   expect(() => {
      const form: Form = {
         firstName: "Charlie",
         lastName: "Spalevic",
         password: "123"
      };
      validateForm(form);
   }).not.toThrowError();
});
