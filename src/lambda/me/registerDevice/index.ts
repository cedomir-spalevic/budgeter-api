import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { validateStr, validateJSONBody } from "middleware/validators";
import { GeneralError } from "models/errors";
import { processRegisterDevice } from "./processor";
import { handleErrorResponse } from "middleware/errors";
import { ObjectId } from "mongodb";

export interface RegisterDeviceBody {
   userId: ObjectId;
   device: "ios" | "android";
   token: string;
}

const validate = async (
   event: APIGatewayProxyEvent
): Promise<RegisterDeviceBody> => {
   const userId = await isAuthorized(event);
   const form = validateJSONBody(event.body);
   const device = validateStr(form, "device", true);
   if (device !== "ios" && device !== "android")
      throw new GeneralError("Device must be ios or android");
   const token = validateStr(form, "token", true);

   return { userId, device, token };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const registerDeviceBody = await validate(event);

      const response = await processRegisterDevice(registerDeviceBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
