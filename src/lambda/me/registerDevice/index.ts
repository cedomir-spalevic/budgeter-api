import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import AWS from "aws-sdk";
import { CreatePlatformEndpointInput } from "aws-sdk/clients/sns";
import DevicesServce from "services/db/device";
import { Device } from "models/auth";

AWS.config.update({ region: process.env.AWS_REGION });
const sns = new AWS.SNS();

const subscribeToTopic = (endpoint: string): Promise<string> => {
   return new Promise((resolve, reject) => {
      const params: AWS.SNS.SubscribeInput = {
         TopicArn: process.env.AWS_SNS_TOPIC,
         Protocol: "application",
         Endpoint: endpoint
      };
      sns.subscribe(params, (error: AWS.AWSError, data: AWS.SNS.SubscribeResponse) => {
         if (error)
            reject(error);
         resolve(data.SubscriptionArn);
      })
   });
}

const createPlatformEndpoint = (device: string, token: string): Promise<string> => {
   return new Promise((resolve, reject) => {
      const platformApp = (device === "ios" ? process.env.AWS_PLATFORM_APPLICATION_IOS : process.env.AWS_PLATFORM_APPLICATION_ANDROID);
      const params: CreatePlatformEndpointInput = {
         PlatformApplicationArn: platformApp,
         Token: token
      }
      sns.createPlatformEndpoint(params, async (error: AWS.AWSError, data: AWS.SNS.CreateEndpointResponse) => {
         if (error)
            reject(error);
         resolve(data.EndpointArn);
      });
   })
}

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
      // Create platform endpoint in Amazon SNS
      const platformApplicationEndpointArn = await createPlatformEndpoint(device, token);

      // Subscribe platform endpoint to Budgeter topic
      const subscriptionArn = await subscribeToTopic(platformApplicationEndpointArn);

      // Create device object in DB
      const devicesService = new DevicesServce();
      const newDevice: Device = {
         userId,
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
         body: "Unable to register device"
      };
   }
}