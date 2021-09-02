import { processChallenge } from "./processor";
import { validate } from "./validator";
import { middy } from "middleware/handler/lambda";

export const handler = middy()
   .useJsonBodyParser()
   .use(validate)
   .use(processChallenge)
   .go();
