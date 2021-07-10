import { RegisterDeviceRequest } from "./type";
import { BudgeterRequest } from "middleware/handler";
import { validateStr } from "middleware/validators";
import { GeneralError } from "models/errors";

export const validate = async (
   request: BudgeterRequest
): Promise<RegisterDeviceRequest> => {
   const {
      auth: { userId },
      body
   } = request;
   const device = validateStr(body, "device", true);
   if (device !== "ios" && device !== "android")
      throw new GeneralError("Device must be ios or android");
   const token = validateStr(body, "token", true);

   return { userId, device, token };
};
