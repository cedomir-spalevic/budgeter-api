import { auth } from "middleware/auth";
import { middy } from "middleware/handler/lambda";
import { processCreatePayment } from "./processor";
import { validate } from "./validator";

export const handler = middy()
   .useAuth(auth)
   .useJsonBodyParser()
   .use(validate)
   .use(processCreatePayment)
   .useDefaultResponseStatusCode(201)
   .go();
