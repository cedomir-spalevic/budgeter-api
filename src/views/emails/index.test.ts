import { test, expect } from "@jest/globals";
import { getEmailView } from ".";

test("New user verification email subject", () => {
   expect(getEmailView("newUserVerification", "123456").subject).toBe(
      "Budgeter - verify your email"
   );
});

test("Password reset email subject", () => {
   expect(getEmailView("passwordReset", "123456").subject).toBe(
      "Budgeter - reset your password"
   );
});

test("User verification email subject", () => {
   expect(getEmailView("userVerification", "123456").subject).toBe(
      "Budgeter - your confirmation code"
   );
});
