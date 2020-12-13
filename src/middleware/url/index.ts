import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";

interface QueryStringParameters {
   limit: number;
   skip: number;
}
interface Params {
   [name: string]: string;
}

export const getQueryStringParameters = (params: Params | null): QueryStringParameters => {
   let limit = 5, skip = 0;
   if (params !== null) {
      if (params["limit"]) {
         let l = Number(params["limit"]);
         if (!l)
            throw new GeneralError("Limit must be a digit greater than 0");
         limit = l;
      }
      if (params["skip"]) {
         let s = Number(params["skip"]);
         if (!s)
            throw new GeneralError("Skip must be a digit greater than 0");
         skip = s;
      }
   }
   return { limit, skip };
}

export const getPathParameter = (name: string, params: Params | null): ObjectId => {
   if (params === null)
      throw new GeneralError("Invalid Id");
   const id = params[name];
   if (!ObjectId.isValid(id))
      throw new GeneralError("Invalid Id");
   return new ObjectId(id);
}