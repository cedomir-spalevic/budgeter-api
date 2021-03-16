import { NoUserFoundError } from "models/errors";
import {
   createPlatformEndpoint,
   subscribeToTopic,
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

   // If a device is already registered, do nothing
   if (user.device) return;

   // Create platform endpoint in Amazon SNS
   const platformApplicationEndpointArn = await createPlatformEndpoint(
      request.device,
      request.token
   );

   // Subscribe platform endpoint to Budgeter topic
   const subscriptionArn = await subscribeToTopic(
      platformApplicationEndpointArn
   );

   user.device = {
      os: request.device,
      platformApplicationEndpointArn,
      subscriptionArn,
   };
   await usersService.update(user);
};
