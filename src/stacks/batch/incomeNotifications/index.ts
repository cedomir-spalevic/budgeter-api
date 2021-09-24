import { apiKeyAuth } from "middleware/auth";
import { middy } from "middleware/handler/stepFunction";
import { processIncomeNotifications } from "./processor";

export const handler = middy()
   .useAuth(apiKeyAuth)
   .use(processIncomeNotifications)
   .go();
