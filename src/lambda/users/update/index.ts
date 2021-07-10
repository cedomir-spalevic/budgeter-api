import { adminAuth } from "middleware/auth";
import { middy } from "middleware/handler";
import { processUpdateUser } from "./processor";
import { validate } from "./validator";

export const handler = middy()
   .useAuth(adminAuth)
   .useJsonBodyParser()
   .use(validate)
   .use(processUpdateUser)
   .go();
