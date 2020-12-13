import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { isStr, isValidJSONBody } from "middleware/validators";
import { GeneralError } from "models/errors";
import { processRegisterDevice } from "./processor";
import { handleErrorResponse } from "middleware/errors";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      const form = isValidJSONBody(event.body);
      const device = isStr(form, "device", true);
      if (device !== "ios" && device !== "android")
         throw new GeneralError("Device must be ios or android");
      const token = isStr(form, "token", true);

      const response = await processRegisterDevice(userId, device, token);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}