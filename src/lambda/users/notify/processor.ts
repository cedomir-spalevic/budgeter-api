// import { GeneralError, NoUserFoundError } from "models/errors";
// import { ObjectId } from "mongodb";
// import UsersService from "services/external/mongodb/users";
// import { publishToEndpoint } from "services/external/aws/sns";

// export const processNotifyUser = async (userId: ObjectId, message: string): Promise<void> => {
//    if (!message)
//       throw new GeneralError("Password cannot be blank");

//    const usersService = await UsersService.getInstance();

//    const user = await usersService.getById(userId);
//    if (user === null)
//       throw new NoUserFoundError();
//    if (!user.device)
//       throw new GeneralError("User does not have a device");

//    await publishToEndpoint(user.device.platformApplicationEndpointArn, message);
// }