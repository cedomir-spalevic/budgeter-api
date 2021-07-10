import { adminAuth } from "middleware/auth";
import { processDeleteAPIKey } from "./processor";
import { validate } from "./validator";
import { middy } from "middleware/handler";

export const handler = middy()
   .useAuth(adminAuth)
   .use(validate)
   .use(processDeleteAPIKey)
   .go();
