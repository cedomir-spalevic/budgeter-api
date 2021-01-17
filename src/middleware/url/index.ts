import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";

export interface QueryStringParameters {
   limit: number;
   skip: number;
   search?: string;
}
interface Params {
   [name: string]: string;
}

export const getQueryStringParameters = (params: Params | null): QueryStringParameters => {
   let limit = 5, skip = 0, search = undefined;
   if (params !== null) {
      if (params["limit"]) {
         let l = Number(params["limit"]);
         if (l < 0)
            throw new GeneralError("Limit must be a digit 0 or greater");
         limit = l;
      }
      if (params["skip"]) {
         let s = Number(params["skip"]);
         if (s < 0)
            throw new GeneralError("Skip must be a digit 0 or greater");
         skip = s;
      }
      if (params["search"]) {
         let s = params["search"];
         if (s)
            search = s;
      }
   }
   return { limit, skip, search };
}

export const getPathParameterId = (name: string, params: Params | null): string => {
   if (params === null)
      throw new GeneralError("Invalid Id");
   return params[name];
}

export const getPathParameter = (name: string, params: Params | null): ObjectId => {
   if (params === null)
      throw new GeneralError("Invalid Id");
   const id = params[name];
   if (!ObjectId.isValid(id))
      throw new GeneralError("Invalid Id");
   return new ObjectId(id);
}