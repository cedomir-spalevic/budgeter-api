import { apiKeyAuth } from "middleware/auth";
import { middy } from "middleware/handler/stepFunction";
import { clearTokens } from "./processor";

export const handler = middy().useAuth(apiKeyAuth).use(clearTokens);