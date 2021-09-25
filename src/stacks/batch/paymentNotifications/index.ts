import { apiKeyAuth } from "middleware/auth";
import { middy } from "middleware/handler/stepFunction";
import { processPaymentNotifications } from "./processor";

export const handler = middy().useAuth(apiKeyAuth).use(processPaymentNotifications).go();