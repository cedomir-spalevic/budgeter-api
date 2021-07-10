import { auth } from "middleware/auth";
import { getBudget } from "./processor";
import { validate } from "./validator";
import { middy } from "middleware/handler";

export const handler = middy().useAuth(auth).use(validate).use(getBudget).go();
