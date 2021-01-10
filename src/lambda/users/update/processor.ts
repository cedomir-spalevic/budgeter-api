// import { UserClaims } from "models/auth";
// import { NoUserFoundError } from "models/errors";
// import { ObjectId } from "mongodb";
// import UsersService from "services/external/mongodb/users";

// export const processUpdateUser = async (userId: ObjectId, claims: UserClaims[]) => {
//    const usersService = await UsersService.getInstance();

//    const user = await usersService.getById(userId);
//    if (user === null)
//       throw new NoUserFoundError();

//    user.isAdmin = claims.includes(UserClaims.Admin);
//    user.isService = claims.includes(UserClaims.Service);
//    await usersService.update(user);
//    return user;
// }