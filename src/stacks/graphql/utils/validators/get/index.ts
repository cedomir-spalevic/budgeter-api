import { Validator } from "jsonschema";
import { GetListQueryStringParameters } from "models/requests";
import schema from "./schema.json";

const validator = new Validator();

export const validate = (
   args: Record<string, unknown>
): GetListQueryStringParameters => {
   validator.validate(args, schema, { throwError: true });
   return {
      skip: args["skip"] as number,
      limit: args["limit"] as number,
      search: args["search"] as string
   };
};
