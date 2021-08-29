import { processChallengeConfirmation } from "./processor";
import { validate } from "./validator";
import { middy } from "middleware/handler/lambda";

const handler = middy()
   .useJsonBodyParser()
   .use(validate)
   .use(processChallengeConfirmation)
   .go();

export default handler;