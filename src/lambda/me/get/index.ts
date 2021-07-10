import { auth } from "middleware/auth";
import { processGetMe } from "./processor";
import { middy } from "middleware/handler";

export const handler = middy()
   .useAuth(auth)
   .use(processGetMe)
   .go()
