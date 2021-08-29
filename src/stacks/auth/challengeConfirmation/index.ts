import { processChallengeConfirmation } from "./processor";
import { validate } from "./validator";
import { middy } from "middleware/handler/lambda";

export const handler = middy()
   .useJsonBodyParser()
   .use(validate)
   .use(processChallengeConfirmation)
   .go();
