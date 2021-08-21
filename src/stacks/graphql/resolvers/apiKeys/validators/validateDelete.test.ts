import { validateDelete } from "./validateDelete";
import { test, expect } from "@jest/globals";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";

let args: Record<string, unknown> = {};

test("Empty apiKeyId", () => {
   expect(() => {
      args = {
         apiKeyId: ""
      };
      validateDelete(args);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid apiKeyId", () => {
   expect(() => {
      args = {
         apiKeyId: "!!!"
      };
      validateDelete(args);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   args = {
      apiKeyId: objectId
   };
   expect(validateDelete(args).apiKeyId.toHexString()).toBe(objectId);
});
