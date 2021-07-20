import { auth } from "middleware/auth";
import { middy } from "middleware/handler";
import { processGetPayment } from "./processor";
import { validate } from "./validator";

export const handler = middy()
   .useAuth(auth)
   .use(validate)
   .use(processGetPayment)
   .go();