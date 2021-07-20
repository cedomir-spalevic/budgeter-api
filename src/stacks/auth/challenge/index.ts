import { processChallenge } from "./processor";
import { validate } from "./validator";
import { middy } from "middleware/handler";

export const handler = middy()
   .useJsonBodyParser()
   .use(validate)
   .use(processChallenge)
   .go();