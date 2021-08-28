import { RegisterDeviceRequest } from "./type";
import { Validator } from "jsonschema";
import schema from "./schema.json";
import { BudgeterRequest } from "models/requests";

const validator = new Validator();

export const validate = async (
   request: BudgeterRequest
): Promise<RegisterDeviceRequest> => {
   const {
      auth: { userId },
      body
   } = request;
   validator.validate(body, schema, { throwError: true });

   return {
      userId,
      device: body["device"] as "ios" | "android",
      token: body["token"] as string
   };
};
