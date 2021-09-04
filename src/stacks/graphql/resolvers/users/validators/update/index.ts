import { Validator } from "jsonschema";
import { AdminUserRequest } from "models/requests";
import { ObjectId } from "mongodb";
import schema from "./schema.json";

const validator = new Validator();

export const validate = (
   request: Record<string, unknown>
): AdminUserRequest => {
   validator.validate(request, schema, { throwError: true });
   return {
      userId: new ObjectId(request["id"] as string),
      firstName: request["firstName"] as string,
      lastName: request["lastName"] as string,
      email: request["email"] as string | null,
      phoneNumber: request["phoneNumber"] as string | null,
      isAdmin: request["isAdmin"] as boolean,
      password: request["password"] as string
   };
};
