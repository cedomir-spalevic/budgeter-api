import { NoUserFoundError } from "models/errors";
import {
   createPlatformEndpoint,
   subscribeToTopic
} from "services/external/aws/sns";
import BudgeterMongoClient from "services/external/mongodb/client";
import { RegisterDeviceBody } from ".";

export const processRegisterDevice = async (
   request: RegisterDeviceBody
): Promise<void> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();

   const user = await usersService.getById(request.userId.toHexString());
   if (user === null) throw new NoUserFoundError();

   if (user.device) return;

   // We keep track of all of the user devices within AWS SNS
   // Each device will give us a token so that Google or Apple can send push notifications to that device
   // So AWS offers an Android and an IOS platform endpoint. So in this request, we need to know which type of device this is (Android or IOS).
   // The mobile client provides a nice way to do this and that's what we're relying on.
   const platformApplicationEndpointArn = await createPlatformEndpoint(
      request.device,
      request.token
   );

   // You can subscribe all platform applications to a specific topic. That way you can publish to that topic and notification will go out to each of its
   // subscribers. This might be nice for marketing purposes, but I will probably never use that
   const subscriptionArn = await subscribeToTopic(
      platformApplicationEndpointArn
   );

   // To send notifications to the specific device, you will need the Platform Application Endpoint ARN. So we store this data in the user object
   // which will then be used later by one of our notification jobs to actually send a notification
   user.device = {
      os: request.device,
      platformApplicationEndpointArn,
      subscriptionArn
   };
   await usersService.update(user);
};
