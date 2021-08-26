import { auth } from "middleware/auth";
import { processGetIncome } from "./processor";
import { validate } from "../../../graphql/resolvers/incomes/validators/validateGet";
import { middy } from "middleware/handler/lambda";

export const handler = middy()
   .useAuth(auth)
   .use(validate)
   .use(processGetIncome)
   .go();
