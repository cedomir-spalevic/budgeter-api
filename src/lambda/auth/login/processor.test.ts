import { NoUserEmailFoundError } from "models/errors";
import { processLogin } from "./processor";
import { test, expect } from "@jest/globals";

test("just testing", () => {
   return processLogin({ phoneNumber: "6309152350", password: "" }).catch(
      (data) => {
         expect(data).toBeInstanceOf(NoUserEmailFoundError);
         expect(data.statusCode).toBe(404);
      }
   );
});
