import { adminAuth } from "middleware/auth";
import { middy } from "middleware/handler";
import { processDeleteUser } from "./processor";
import { validate } from "./validator";

export const handler = middy()
   .useAuth(adminAuth)
   .use(validate)
   .use(processDeleteUser)
   .go();
