import { NoUserEmailFoundError, UnauthorizedError } from "models/errors";
import { processLogin } from "./processor";
import { test, expect } from "@jest/globals";

test("No user found", () => {
   expect(async () => {
      await processLogin({ phoneNumber: "6309152350", password: "" })
   }).rejects.toBeInstanceOf(NoUserEmailFoundError);
});


test("Incorrect password", () => {
   expect(async () => {
      await processLogin({ phoneNumber: "+1630 915 2350", password: "" })
   }).rejects.toBeInstanceOf(UnauthorizedError);
});

test("Valid login with phone number", () => {
   expect(async () => {
      await processLogin({ phoneNumber: "+1630 915 2350", password: "MTIzNDU2IUE=" })
   }).resolves;
})

test("Valid login with email", () => {
   expect(async () => {
      await processLogin({ email: "cedomir.spalevic@gmail.com", password: "MTIzNDU2IUE=" })
   }).resolves;
})