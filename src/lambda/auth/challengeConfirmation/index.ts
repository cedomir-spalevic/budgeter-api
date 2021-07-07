import { APIGatewayProxyEvent } from "aws-lambda";
import { getPathParameterId } from "middleware/url";
import { validateJSONBody } from "middleware/validators";
import { processChallengeConfirmation } from "./processor";
import { ChallengeConfirmationRequest, validate } from "./validator";
import { middy } from "middleware/handler";

const requestTransformer = (
   event: APIGatewayProxyEvent
): ChallengeConfirmationRequest => {
   const key = getPathParameterId("key", event.pathParameters);
   const form = validateJSONBody(event.body);
   return { key, form };
};

export const handler = middy()
   .useRequestTransformer(requestTransformer)
   .use(validate)
   .use(processChallengeConfirmation)
   .go();
