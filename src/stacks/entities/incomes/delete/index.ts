import { auth } from "middleware/auth";
import { processDeleteIncome } from "./processor";
import { validate } from "./validator";
import { middy } from "middleware/handler/lambda";

export const handler = middy()
   .useAuth(auth)
   .use(validate)
   .use(processDeleteIncome)
   .go();
