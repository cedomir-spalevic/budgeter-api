import { apiKeyAuth } from "middleware/auth";
import { clearTokens } from "./processor";
import { middy } from "middleware/handler/stepFunction";

export const handler = middy().useAuth(apiKeyAuth).use(clearTokens).go();