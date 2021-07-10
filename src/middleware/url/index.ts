import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { GeneralError } from "models/errors";
import {
   GetBudgetQueryStringParameters,
   GetListQueryStringParameters
} from "models/requests";
import { ObjectId } from "mongodb";

export const getBudgetQueryStringParameters = (
   params: APIGatewayProxyEventQueryStringParameters
): GetBudgetQueryStringParameters => {
   if (!params)
      throw new GeneralError(
         "date, month and year query strings must be provided"
      );
   if (!params["date"]) throw new GeneralError("date is required");
   if (!params["month"]) throw new GeneralError("month is required");
   if (!params["year"]) throw new GeneralError("year is required");
   if (Number.isNaN(parseInt(params["date"], 10)))
      throw new GeneralError("date must be a number");
   if (Number.isNaN(parseInt(params["month"], 10)))
      throw new GeneralError("month must be a number");
   if (Number.isNaN(parseInt(params["year"], 10)))
      throw new GeneralError("year must be a number");
   const date = Number(params["date"]);
   if (date < 1 || date > 31)
      throw new GeneralError("date must be between 1 and 31");
   const month = Number(params["month"]);
   if (month < 0 || month > 11)
      throw new GeneralError("month must be between 0 and 11");
   const year = Number(params["year"]);
   if (year < 0 || year.toString().length !== 4)
      throw new GeneralError("year is not valid");
   return { date, month, year };
};

export const getListQueryStringParameters = (
   params: APIGatewayProxyEventQueryStringParameters
): GetListQueryStringParameters => {
   let limit = 5,
      skip = 0,
      search = undefined;
   if (params !== null) {
      if (params["limit"]) {
         if (Number.isNaN(parseInt(params["limit"], 10)))
            throw new GeneralError("limit must be a number");
         const l = Number(params["limit"]);
         if (l < 0) throw new GeneralError("limit must be greater than 0");
         limit = l;
      }
      if (params["skip"]) {
         if (Number.isNaN(parseInt(params["skip"], 10)))
            throw new GeneralError("skip must be a number");
         const s = Number(params["skip"]);
         if (s < 0) throw new GeneralError("skip must be greater than 0");
         skip = s;
      }
      if (params["search"]) {
         const s = params["search"];
         if (s) search = s;
      }
   }
   return { limit, skip, search };
};

export const validatePathParameterId = (
   name: string,
   params: { [name: string]: any } | null
): ObjectId => {
   if (params === null) throw new GeneralError("Invalid Id");
   const id = params[name];
   if (!ObjectId.isValid(id)) throw new GeneralError("Invalid Id");
   return new ObjectId(id);
};

export const getPathParameterId = (
   name: string,
   params: { [name: string]: any } | null
): string => {
   if (params === null) throw new GeneralError("Invalid Id");
   return params[name];
};

export const getPathParameter = (
   name: string,
   params: { [name: string]: any } | null
): ObjectId => {
   if (params === null) throw new GeneralError("Invalid Id");
   const id = params[name];
   if (!ObjectId.isValid(id)) throw new GeneralError("Invalid Id");
   return new ObjectId(id);
};
