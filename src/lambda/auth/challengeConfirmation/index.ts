import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameterId } from "middleware/url";
import { isNumber, isValidJSONBody } from "middleware/validators";
import { processRegisterConfirmation } from "./processor";

export interface RegisterConfirmationBody {
   key: string;
   code: number;
}

const validator = (event: APIGatewayProxyEvent): RegisterConfirmationBody => {
   const key = getPathParameterId("key", event.pathParameters);
   const form = isValidJSONBody(event.body);
   const code = isNumber(form, "code", true);

   return { key, code };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const registerConfirmationBody = validator(event);
      const response = await processRegisterConfirmation(
         registerConfirmationBody
      );
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
