import { BudgeterRequest } from "models/requests";
import { runValidation } from "services/internal/validation";
import schema from "./schema.json";

export interface RegisterBody {
   firstName: string;
   lastName: string;
   email?: string;
   phoneNumber?: string;
   password: string;
}

export const validate = (request: BudgeterRequest): RegisterBody => {
   const { body } = request;
   runValidation(body, schema);

   return {
      firstName: body["firstName"] as string,
      lastName: body["lastName"] as string,
      email: body["email"] as string,
      phoneNumber: body["phoneNumber"] as string,
      password: body["password"] as string
   };
};
