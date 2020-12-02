import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { publishMessage } from "services/aws/sns";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const response = await publishMessage("Hey, your payment is due today");
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: JSON.stringify(error)
      }
   }
}