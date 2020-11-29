import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import AWS from "aws-sdk";
import { CreatePlatformEndpointInput } from "aws-sdk/clients/sns";
import DevicesServce from "services/db/device";
import { Device } from "models/auth";

AWS.config.update({ region: "us-east-1" });

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
      const platformApp = (device === "ios" ? process.env.AWS_PLATFORM_APPLICATION_IOS : process.env.AWS_PLATFORM_APPLICATION_ANDROID);
      const params: CreatePlatformEndpointInput = {
         PlatformApplicationArn: platformApp,
         Token: token
      }
      const sns = new AWS.SNS();
      sns.createPlatformEndpoint(params, async (error: AWS.AWSError, data: AWS.SNS.CreateEndpointResponse) => {
         if (error)
            throw new Error();
         const devicesService = new DevicesServce();
         const newDevice: Device = {
            userId,
            device,
            platformEndpoint: data.EndpointArn
         }
         await devicesService.create(newDevice);
      });
      return {
         statusCode: 200,
         body: ""
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: "Unable to register device"
      };
   }
}