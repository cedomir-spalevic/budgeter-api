import { APIGatewayProxyResult } from "aws-lambda";
import { LoginResponse, processLogin } from "./processor";
import { validate } from "./validator";
import { middy } from "middleware/handler";

const responseTransformer = (
   response: LoginResponse
): APIGatewayProxyResult => {
   return {
      statusCode: response.status,
      body: JSON.stringify(response.response)
   };
};

export const handler = middy()
   .use(validate)
   .use(processLogin)
   .useResponseTransformer(responseTransformer)
   .go();
