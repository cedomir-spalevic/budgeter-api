import { APIGatewayProxyResult } from "aws-lambda";
import { processLogin } from "./processor";
import { validate } from "./validator";
import { middy } from "middleware/handler/lambda";
import { LoginResponse } from "./type";

const responseTransformer = (
   response: LoginResponse
): APIGatewayProxyResult => {
   return {
      statusCode: response.status,
      body: JSON.stringify(response.response)
   };
};

const handler = middy()
   .useJsonBodyParser()
   .use(validate)
   .use(processLogin)
   .useResponseTransformer(responseTransformer)
   .go();

export default handler;