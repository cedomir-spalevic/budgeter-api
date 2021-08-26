import { auth } from "middleware/auth";
import { processCreateIncome } from "./processor";
import { validate } from "./validator";
import { middy } from "middleware/handler/lambda";

export const handler = middy()
   .useAuth(auth)
   .useJsonBodyParser()
   .use(validate)
   .use(processCreateIncome)
   .useDefaultResponseStatusCode(201)
   .go();
