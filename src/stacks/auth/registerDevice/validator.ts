import { RegisterDeviceRequest } from "./type";
import schema from "./schema.json";
import { BudgeterRequest } from "models/requests";
import { runValidation } from "services/internal/validation";

export const validate = async (
   request: BudgeterRequest
): Promise<RegisterDeviceRequest> => {
   const {
      auth: { userId },
      body
   } = request;
   runValidation(body, schema);

   return {
      userId,
      device: body["device"] as "ios" | "android",
      token: body["token"] as string
   };
};
