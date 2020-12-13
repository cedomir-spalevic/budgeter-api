import { NoUserFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import { createPlatformEndpoint, subscribeToTopic } from "services/external/aws/sns";
import UsersService from "services/external/mongodb/users";

export const processRegisterDevice = async (userId: ObjectId, device: string, token: string) => {
   const usersService = await UsersService.getInstance();
   const user = await usersService.getById(userId);
   if (user === null)
      throw new NoUserFoundError();

   // If a device is already registered, do nothing
   if (user.device)
      return;

   // Create platform endpoint in Amazon SNS
   const platformApplicationEndpointArn = await createPlatformEndpoint(device, token);

   // Subscribe platform endpoint to Budgeter topic
   const subscriptionArn = await subscribeToTopic(platformApplicationEndpointArn);

   user.device = {
      os: device,
      platformApplicationEndpointArn,
      subscriptionArn
   }
   await usersService.update(user);
}