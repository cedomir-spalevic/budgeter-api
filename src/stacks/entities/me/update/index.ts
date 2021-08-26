import { auth } from "middleware/auth";
import { middy } from "middleware/handler/lambda";
import { processUpdateUser } from "./processor";
import { validate } from "./validator";

export const handler = middy()
   .useAuth(auth)
   .useJsonBodyParser()
   .use(validate)
   .use(processUpdateUser)
   .go();
