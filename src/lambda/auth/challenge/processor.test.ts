import { test, expect } from "@jest/globals";
import { NotFoundError } from "models/errors";
import { processChallenge } from "./processor";

test("User email not found", () => {
   expect(async () => {
      await processChallenge({ email: "cc", type: "userVerification" });
   }).rejects.toBeInstanceOf(NotFoundError);
});

test("User phone number not found", () => {
   expect(async () => {
      await processChallenge({ phoneNumber: "cc", type: "userVerification" });
   }).rejects.toBeInstanceOf(NotFoundError);
});
