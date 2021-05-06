import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { validateJSONBody } from "middleware/validators";
import { processCreatePayment } from "./processor";
import { validate } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      const form = validateJSONBody(event.body);
      const paymentBody = validate(form);
      paymentBody.userId = userId;
      const response = await processCreatePayment(paymentBody);
      return {
         statusCode: 201,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
