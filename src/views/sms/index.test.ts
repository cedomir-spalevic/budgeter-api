import { test, expect } from "@jest/globals";
import { getSmsMessage } from ".";

test("New user verification email subject", () => {
   expect(getSmsMessage("newUserVerification", "123456")).toBe(
      "123456 is your Budgeter confirmation code"
   );
});

test("Password reset email subject", () => {
   expect(getSmsMessage("passwordReset", "123456")).toBe(
      "123456 is your Budgeter confirmation code"
   );
});

test("User verification email subject", () => {
   expect(getSmsMessage("userVerification", "123456")).toBe(
      "123456 is your Budgeter confirmation code"
   );
});
