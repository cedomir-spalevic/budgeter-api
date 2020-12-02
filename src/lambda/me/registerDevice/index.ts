import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import DevicesService from "services/db/device";
import { Device } from "models/auth";
import { createPlatformEndpoint, subscribeToTopic } from "services/aws/sns";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   let userId: string;
   try {
      userId = await isAuthorized(event);
   }
   catch (event) {
      return {
         statusCode: 401,
         body: ""
      };
   }

   const requestFormBody = JSON.parse(event.body);
   const device = requestFormBody["device"];
   const token = requestFormBody["token"];

   if (!device) {
      return {
         statusCode: 400,
         body: "Device is required in request body"
      }
   }
   if (device !== "ios" && device !== "android")
      return {
         statusCode: 400,
         body: "Device must be ios or android"
      }
   if (!token) {
      return {
         statusCode: 400,
         body: "Token is required in request body"
      }
   }

   try {
      // Don't create anything if the user already has a device
      const devicesService = new DevicesService(userId);
      const containsDevice = await devicesService.containsDevice();
      if (containsDevice)
         return {
            statusCode: 200,
            body: ""
         }

      // Create platform endpoint in Amazon SNS
      const platformApplicationEndpointArn = await createPlatformEndpoint(device, token);

      // Subscribe platform endpoint to Budgeter topic
      const subscriptionArn = await subscribeToTopic(platformApplicationEndpointArn);

      // Create device object in DB
      const newDevice: Device = {
         device,
         platformApplicationEndpointArn,
         subscriptionArn
      }
      await devicesService.create(newDevice);

      return {
         statusCode: 200,
         body: ""
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: JSON.stringify(error)
      };
   }
}