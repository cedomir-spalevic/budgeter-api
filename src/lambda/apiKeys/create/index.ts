import { adminAuth } from "middleware/auth";
import { processCreateAPIKey } from "./processor";
import { middy } from "middleware/handler";

export const handler = middy().useAuth(adminAuth).use(processCreateAPIKey).go();
