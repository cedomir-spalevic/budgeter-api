import { test, expect } from "@jest/globals";
import { validate } from ".";

test("Valid day of month", () => {
   const args: Record<string, unknown> = {
      date: 27,
      month: 0,
      year: 2021
   };
   expect(validate(args)).toBeTruthy();
});

test("Valid day of month", () => {
   const args: Record<string, unknown> = {
      date: 1,
      month: 0,
      year: 2021
   };
   expect(validate(args)).toBeTruthy();
});

test("Valid day of month", () => {
   const args: Record<string, unknown> = {
      date: 31,
      month: 0,
      year: 2021
   };
   expect(validate(args)).toBeTruthy();
});

test("Invalid day of month", () => {
   const args: Record<string, unknown> = {
      date: 32,
      month: 0,
      year: 2021
   };
   expect(() => validate(args)).toThrowError();
});

test("Invalid day of month", () => {
   const args: Record<string, unknown> = {
      date: -1,
      month: 0,
      year: 2021
   };
   expect(() => validate(args)).toThrowError();
});

test("Valid month", () => {
   const args: Record<string, unknown> = {
      date: 1,
      month: 0,
      year: 2021
   };
   expect(validate(args)).toBeTruthy();
});

test("Valid month", () => {
   const args: Record<string, unknown> = {
      date: 1,
      month: 11,
      year: 2021
   };
   expect(validate(args)).toBeTruthy();
});

test("Valid month", () => {
   const args: Record<string, unknown> = {
      date: 1,
      month: 6,
      year: 2021
   };
   expect(validate(args)).toBeTruthy();
});

test("Invalid month", () => {
   const args: Record<string, unknown> = {
      date: 1,
      month: 12,
      year: 2021
   };
   expect(() => validate(args)).toThrowError();
});

test("Invalid month", () => {
   const args: Record<string, unknown> = {
      date: 1,
      month: -1,
      year: 2021
   };
   expect(() => validate(args)).toThrowError();
});

test("Valid year", () => {
   const args: Record<string, unknown> = {
      date: 1,
      month: 1,
      year: 2021
   };
   expect(validate(args)).toBeTruthy();
});

test("Valid year", () => {
   const args: Record<string, unknown> = {
      date: 1,
      month: 1,
      year: -999999
   };
   expect(validate(args)).toBeTruthy();
});

test("Valid year", () => {
   const args: Record<string, unknown> = {
      date: 1,
      month: 1,
      year: 999999
   };
   expect(validate(args)).toBeTruthy();
});

test("Invalid year", () => {
   const args: Record<string, unknown> = {
      date: 1,
      month: -1,
      year: 1000000
   };
   expect(() => validate(args)).toThrowError();
});

test("Invalid year", () => {
   const args: Record<string, unknown> = {
      date: 1,
      month: -1,
      year: -1000000
   };
   expect(() => validate(args)).toThrowError();
});
