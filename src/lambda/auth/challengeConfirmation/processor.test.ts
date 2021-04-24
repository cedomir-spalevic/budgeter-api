import { test, expect } from "@jest/globals";
import { UnauthorizedError } from "models/errors";
import { v4 } from "uuid";
import { processChallengeConfirmation } from "./processor";

test("Invalid key", () => {
   expect(async () => {
      const key = v4();
      await processChallengeConfirmation({ key, code: 123456 })
   }).rejects.toBeInstanceOf(UnauthorizedError);
})