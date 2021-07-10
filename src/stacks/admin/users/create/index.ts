import { adminAuth } from "middleware/auth";
import { middy } from "middleware/handler";
import { processCreateUser } from "./processor";
import { validate } from "./validator";

export const handler = middy()
   .useAuth(adminAuth)
   .useJsonBodyParser()
   .use(validate)
   .use(processCreateUser)
   .useDefaultResponseStatusCode(201)
   .go();
