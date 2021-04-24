import { test, expect } from "@jest/globals";
import { parsePhoneNumber } from ".";

test("Invalid phone number", () => {
   expect(parsePhoneNumber("123").isValid).toBe(false);
});

test("Invalid phone number", () => {
   expect(parsePhoneNumber("!!!!------").isValid).toBe(false);
});

test("Invalid phone number", () => {
   expect(parsePhoneNumber("aaaaaaa").isValid).toBe(false);
});

test("Invalid phone number", () => {
   expect(parsePhoneNumber("123456123456").isValid).toBe(false);
});

test("Valid phone number", () => {
   expect(parsePhoneNumber("(630) 915-2350").isValid).toBe(true);
});

test("Valid phone number", () => {
   expect(parsePhoneNumber("6309152359").isValid).toBe(true);
});
