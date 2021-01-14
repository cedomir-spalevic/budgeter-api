// import { ObjectId } from "mongodb";
// import PaymentsService from "services/external/mongodb/payments";
// import BudgetsService from "services/external/mongodb/budgets";
// import UsersService from "services/external/mongodb/users";
// import { NoUserFoundError } from "models/errors";
// import { deletePlatformEndpoint, unsubscribeFromTopic } from "services/external/aws/sns";

// export const processDeleteUser = async (userId: ObjectId) => {
//    const usersService = await UsersService.getInstance();
//    const budgetsService = await BudgetsService.getInstance(userId);
//    const paymentsService = await PaymentsService.getInstance(userId);

//    // Check if user exists
//    const user = await usersService.getById(userId);
//    if (user === null)
//       throw new NoUserFoundError();

//    // Delete all budgets
//    await budgetsService.deleteAll();

//    // Delete all payments
//    await paymentsService.deleteAll();

//    // Delete AWS SNS Subscription and Endpoint
//    if (user.device) {
//       await unsubscribeFromTopic(user.device.subscriptionArn);
//       await deletePlatformEndpoint(user.device.platformApplicationEndpointArn);
//    }

//    // TODO delete user
//    await usersService.delete(userId);
// }