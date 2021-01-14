// import {
//    APIGatewayProxyEvent,
//    APIGatewayProxyResult
// } from "aws-lambda";
// import { isAdminAuthorized } from "middleware/auth";
// import { handleErrorResponse } from "middleware/errors";
// import { getPathParameter, getQueryStringParameters } from "middleware/url";
// import { processGetUser, processGetUsers } from "./processor";

// export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//    try {
//       await isAdminAuthorized(event);
//       let response;
//       if (event.pathParameters === null) {
//          const queryStrings = getQueryStringParameters(event.queryStringParameters);
//          response = await processGetUsers(queryStrings.limit, queryStrings.skip);
//       }
//       else {
//          const userId = getPathParameter("userId", event.pathParameters);
//          response = await processGetUser(userId);
//       }
//       return {
//          statusCode: 200,
//          body: JSON.stringify(response)
//       }
//    }
//    catch (error) {
//       return handleErrorResponse(error);
//    }
// }