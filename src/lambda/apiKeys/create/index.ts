import { adminAuth } from "middleware/auth";
import { processCreateAPIKey } from "./processor";
import { middy } from "middleware/handler";

export const handler = middy()
   .useAuth(adminAuth)
   .use(processCreateAPIKey)
   .go();

// export const handler = async (
//    event: APIGatewayProxyEvent
// ): Promise<APIGatewayProxyResult> => {
//    try {
//       await isAdminAuthorized(event);
//       const response = await processCreateAPIKey();
//       return {
//          statusCode: 200,
//          body: JSON.stringify(response)
//       };
//    } catch (error) {
//       return handleErrorResponse(error);
//    }
// };
