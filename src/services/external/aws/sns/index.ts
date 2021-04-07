import AWS from "aws-sdk";
import {
   CreatePlatformEndpointInput,
   MessageAttributeValue
} from "aws-sdk/clients/sns";
import { PromiseResult } from "aws-sdk/lib/request";

const sns = new AWS.SNS();

export const subscribeToTopic = (
   endpoint: string
): Promise<PromiseResult<AWS.SNS.SubscribeResponse, AWS.AWSError>> => {
   const params: AWS.SNS.SubscribeInput = {
      TopicArn: process.env.AWS_SNS_TOPIC,
      Protocol: "application",
      Endpoint: endpoint
   };
   return sns.subscribe(params).promise();
};

export const unsubscribeFromTopic = (
   subscriptionArn: string
): Promise<{
   // eslint-disable-next-line @typescript-eslint/ban-types
   $response: AWS.Response<{}, AWS.AWSError>;
}> => {
   const params: AWS.SNS.UnsubscribeInput = {
      SubscriptionArn: subscriptionArn
   };
   return sns.unsubscribe(params).promise();
};

export const deletePlatformEndpoint = (
   endpointArn: string
): Promise<{
   // eslint-disable-next-line @typescript-eslint/ban-types
   $response: AWS.Response<{}, AWS.AWSError>;
}> => {
   const params: AWS.SNS.DeleteEndpointInput = {
      EndpointArn: endpointArn
   };
   return sns.deleteEndpoint(params).promise();
};

export const createPlatformEndpoint = (
   device: string,
   token: string
): Promise<PromiseResult<AWS.SNS.CreateEndpointResponse, AWS.AWSError>> => {
   const platformApp =
      device === "ios"
         ? process.env.AWS_PLATFORM_APPLICATION_IOS
         : process.env.AWS_PLATFORM_APPLICATION_ANDROID;
   const params: CreatePlatformEndpointInput = {
      PlatformApplicationArn: platformApp,
      Token: token
   };
   return sns.createPlatformEndpoint(params).promise();
};

export const publishToEndpoint = (
   endpointArn: string,
   message: string
): Promise<PromiseResult<AWS.SNS.PublishResponse, AWS.AWSError>> => {
   const msgAttr: MessageAttributeValue = {
      DataType: "Number",
      StringValue: "90"
   };
   const params: AWS.SNS.PublishInput = {
      TargetArn: endpointArn,
      Message: message,
      MessageAttributes: {
         "AWS.SNS.MOBILE.APNS.TTL": msgAttr,
         "AWS.SNS.MOBILE.APNS_SANDBOX.TTL": msgAttr,
         "AWS.SNS.MOBILE.FCM.TTL": msgAttr
      }
   };
   return sns.publish(params).promise();
};

export const sendTextMessage = (
   phoneNumber: string,
   message: string
): Promise<PromiseResult<AWS.SNS.PublishResponse, AWS.AWSError>> => {
   const params: AWS.SNS.PublishInput = {
      PhoneNumber: phoneNumber,
      Message: message
   };
   return sns.publish(params).promise();
};

export const publishToTopic = (
   message: string
): Promise<PromiseResult<AWS.SNS.PublishResponse, AWS.AWSError>> => {
   const msgAttr: MessageAttributeValue = {
      DataType: "Number",
      StringValue: "90"
   };
   const params: AWS.SNS.PublishInput = {
      TopicArn: process.env.AWS_SNS_TOPIC,
      Message: message,
      MessageAttributes: {
         "AWS.SNS.MOBILE.APNS.TTL": msgAttr,
         "AWS.SNS.MOBILE.APNS_SANDBOX.TTL": msgAttr,
         "AWS.SNS.MOBILE.FCM.TTL": msgAttr
      }
   };
   return sns.publish(params).promise();
};
