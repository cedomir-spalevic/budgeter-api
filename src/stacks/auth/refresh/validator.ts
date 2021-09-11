import { RefreshRequest } from "./type";
import schema from "./schema.json";
import { BudgeterRequest } from "models/requests";
import { runValidation } from "services/internal/validation";

export const validate = (request: BudgeterRequest): RefreshRequest => {
   const { body } = request;
   runValidation(body, schema);
   return {
      refreshToken: body["refreshToken"] as string
   };
};
