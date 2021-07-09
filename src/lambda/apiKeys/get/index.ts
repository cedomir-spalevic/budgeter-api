import { adminAuth } from "middleware/auth";
import { processGetAPIKeys } from "./processor";
import { middy } from "middleware/handler";

export const handler = middy()
   .useAuth(adminAuth)
   .use(processGetAPIKeys)
   .go();
