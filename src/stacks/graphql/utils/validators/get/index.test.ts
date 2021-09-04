import { expect, test } from "@jest/globals";
import { validate } from ".";

test("Invalid limit", () => {
   expect(() => {
      const args: Record<string, unknown> = {
         limit: -1
      };
      validate(args);
   }).toThrowError();
});

test("Invalid limit", () => {
   expect(() => {
      const args: Record<string, unknown> = {
         limit: "a"
      };
      validate(args);
   }).toThrowError();
});

test("Invalid limit", () => {
   expect(() => {
      const args: Record<string, unknown> = {
         limit: "null"
      };
      validate(args);
   }).toThrowError();
});

test("Valid limit", () => {
   const args: Record<string, unknown> = {
      limit: 7,
      skip: 1
   };
   const result = validate(args);
   expect(result.limit).toBe(7);
   expect(result.skip).toBe(1);
});

test("Invalid skip", () => {
   expect(() => {
      const args: Record<string, unknown> = {
         skip: -1
      };
      validate(args);
   }).toThrowError();
});

test("Invalid skip", () => {
   expect(() => {
      const args: Record<string, unknown> = {
         skip: "a"
      };
      validate(args);
   }).toThrowError();
});

test("Invalid skip", () => {
   expect(() => {
      const args: Record<string, unknown> = {
         skip: "null"
      };
      validate(args);
   }).toThrowError();
});

test("Valid skip", () => {
   const args: Record<string, unknown> = {
      skip: 7,
      limit: 1
   };
   const result = validate(args);
   expect(result.limit).toBe(1);
   expect(result.skip).toBe(7);
});

test("Valid query strings", () => {
   const args: Record<string, unknown> = {
      limit: 10,
      skip: 5
   };
   const result = validate(args);
   expect(result.limit).toBe(10);
   expect(result.skip).toBe(5);
});

test("Valid query strings with", () => {
   const args: Record<string, unknown> = {
      limit: 10,
      skip: 5,
      search: "Test"
   };
   const result = validate(args);
   expect(result.limit).toBe(10);
   expect(result.skip).toBe(5);
   expect(result.search).toBe("Test");
});
