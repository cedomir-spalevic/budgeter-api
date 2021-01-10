// import {
//    APIGatewayProxyEvent,
//    APIGatewayProxyResult
// } from "aws-lambda";
// import { isAdminAuthorized } from "middleware/auth";
// import { handleErrorResponse } from "middleware/errors";
// import { getPathParameter } from "middleware/url";
// import { processDeleteUser } from "./processor";

// export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//    try {
//       await isAdminAuthorized(event);
//       const userId = getPathParameter("userId", event.pathParameters);

//       await processDeleteUser(userId);
//       return {
//          statusCode: 200,
//          body: ""
//       }
//    }
//    catch (error) {
//       return handleErrorResponse(error);
//    }
// }