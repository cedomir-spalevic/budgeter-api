import { GeneralError } from "models/errors";
import { GetBudgetQueryStringParameters, GetListQueryStringParameters } from "models/requests";
import { ObjectId } from "mongodb";

interface Params {
   [name: string]: string;
}

export const getBudgetQueryStringParameters = (params: Params | null): GetBudgetQueryStringParameters => {
   let date = new Date();
   let month = date.getUTCMonth(), year = date.getUTCFullYear()
   if (params !== null) {
      if (params["month"]) {
         let m = Number(params["month"]);
         if (m < 1 || m > 12)
            throw new GeneralError("Month must be between 1 and 12");
         month = m;
      }
      if (params["year"]) {
         let y = Number(params["year"]);
         if (y < 0 || params["year"].length !== 4)
            throw new GeneralError("Year must be valid");
         year = y;
      }
   }
   return { month, year };
}

export const getListQueryStringParameters = (params: Params | null): GetListQueryStringParameters => {
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