import { processRefresh } from "./processor";
import { validate } from "./validator";
import { middy } from "middleware/handler/lambda";

const handler = middy()
   .useJsonBodyParser()
   .use(validate)
   .use(processRefresh)
   .go();

export default handler;