import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { processRefresh } from "./processor";
import { handleErrorResponse } from "middleware/errors";
import { isStr, isValidJSONBody } from "middleware/validators";

export interface RefreshBody {
   refreshToken: string;
}

const validator = (event: APIGatewayProxyEvent): RefreshBody => {
   const form = isValidJSONBody(event.body);
   const refreshToken = isStr(form, "refreshToken", true);
   return { refreshToken };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const refreshBody = validator(event);
      const response = await processRefresh(refreshBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response),
         headers: {
            "Access-Control-Allow-Origin": "*",
         },
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
