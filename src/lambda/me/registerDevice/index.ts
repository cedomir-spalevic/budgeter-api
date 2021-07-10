import { auth } from "middleware/auth";
import { processRegisterDevice } from "./processor";
import { middy } from "middleware/handler";
import { validate } from "./validator";

export const handler = middy()
   .useAuth(auth)
   .useJsonBodyParser()
   .use(validate)
   .use(processRegisterDevice)
   .go();