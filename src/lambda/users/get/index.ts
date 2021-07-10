import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { adminAuth, isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { middy } from "middleware/handler";
import { AdminPublicUser } from "models/data/user";
import { GetResponse } from "models/responses";
import { processGetMany, processGetSingle, processGetUser } from "./processor";
import { validate } from "./validator";

export const handler = middy()
   .useAuth(adminAuth)
   .use(validate)
   .use(processGetUser)
   .go();
