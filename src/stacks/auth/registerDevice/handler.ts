import { auth } from "middleware/auth";
import { processRegisterDevice } from "./processor";
import { middy } from "middleware/handler/lambda";
import { validate } from "./validator";

const handler = middy()
   .useAuth(auth)
   .useJsonBodyParser()
   .use(validate)
   .use(processRegisterDevice)
   .go();

export default handler;
