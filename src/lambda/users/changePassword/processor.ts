// import { GeneralError, NoUserFoundError } from "models/errors";
// import { ObjectId } from "mongodb";
// import UsersService from "services/external/mongodb/users";
// import UserAuthService from "services/external/mongodb/userAuth";

// export const processChangePassword = async (userId: ObjectId, password: string): Promise<void> => {
//    if (!password)
//       throw new GeneralError("Password cannot be blank");

//    const usersService = await UsersService.getInstance();
//    const userAuthService = await UserAuthService.getInstance();

//    const user = await usersService.getById(userId);
//    if (user === null)
//       throw new NoUserFoundError();

//    await userAuthService.update(userId, password);
// }