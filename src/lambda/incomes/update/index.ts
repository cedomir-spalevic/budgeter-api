import { auth } from "middleware/auth";
import { processUpdateIncome } from "./processor";
import { validate } from "./validator";
import { middy } from "middleware/handler";

export const handler = middy()
   .useAuth(auth)
   .useJsonBodyParser()
   .use(validate)
   .use(processUpdateIncome)
   .go();
