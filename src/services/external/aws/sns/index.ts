import AWS from "aws-sdk";
import { CreatePlatformEndpointInput, MessageAttributeValue } from "aws-sdk/clients/sns";

const sns = new AWS.SNS();

export const subscribeToTopic = (endpoint: string): Promise<string> => {
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

export const unsubscribeFromTopic = (subscriptionArn: string): Promise<void> => {
   return new Promise((resolve, reject) => {
      const params: AWS.SNS.UnsubscribeInput = {
         SubscriptionArn: subscriptionArn
      }
      sns.unsubscribe(params, (error: AWS.AWSError, data: any) => {
         if (error)
            reject(error);
         resolve();
      });
   });
}

export const deletePlatformEndpoint = (endpointArn: string): Promise<void> => {
   return new Promise(async (resolve, reject) => {
      const params: AWS.SNS.DeleteEndpointInput = {
         EndpointArn: endpointArn
      };
      sns.deleteEndpoint(params, (error: AWS.AWSError, data: any) => {
         if (error)
            reject(error);
         resolve();
      });
   });
}

export const createPlatformEndpoint = (device: string, token: string): Promise<string> => {
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

export const publishMessage = (message: string): Promise<any> => {
   return new Promise((resolve, reject) => {
      const msgAttr: MessageAttributeValue = {
         DataType: "Number",
         StringValue: "90"
      }
      const params: AWS.SNS.PublishInput = {
         TopicArn: process.env.AWS_SNS_TOPIC,
         Message: message,
         MessageAttributes: {
            "AWS.SNS.MOBILE.APNS.TTL": msgAttr,
            "AWS.SNS.MOBILE.APNS_SANDBOX.TTL": msgAttr,
            "AWS.SNS.MOBILE.FCM.TTL": msgAttr
         }
      }
      sns.publish(params, (err: AWS.AWSError, data: AWS.SNS.PublishResponse) => {
         if (err)
            reject(err);
         resolve(data);
      })
   })
}