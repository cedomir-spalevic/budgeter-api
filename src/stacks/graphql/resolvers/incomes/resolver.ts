import { BudgeterRequestAuth } from "middleware/handler";
import { AdminUserRequest, GetListQueryStringParameters } from "models/requests";
import { PublicBudgetItem } from "models/schemas/budgetItem";
import { Income } from "models/schemas/income";
import { AdminPublicUser } from "models/schemas/user";
import { ObjectId } from "mongodb";
import IncomesProcessor from "./processor";

const resolvers = {
   incomes: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<PublicBudgetItem[]> => {
      const queryStringParameters: GetListQueryStringParameters = {
         skip: args["skip"] as number,
         limit: args["limit"] as number
      }
      const incomesProcessor = await IncomesProcessor.getInstance(context.userId);
      return incomesProcessor.get(queryStringParameters);
   },
   incomeById: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<PublicBudgetItem> => {
      const userId = args["userId"] as string;
      const incomesProcessor = await IncomesProcessor.getInstance(context.userId);
      return incomesProcessor.getById(new ObjectId(userId));
   },
   // -
   // deleteUser: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<ObjectId> => {
   //    await graphqlAdminAuth(context);
   //    const userId = args["userId"] as string;
   //    return deleteUser(new ObjectId(userId));
   // },
   // updateUser: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<AdminPublicUser> => {
   //    await graphqlAdminAuth(context);
   //    const userId = args["userId"] as string;
   //    const userInput = args["user"] as Record<string, unknown>;
   //    const request: AdminUserRequest = {
   //       userId: new ObjectId(userInput["id"] as string),
   //       firstName: userInput["firstName"] as string,
   //       lastName: userInput["lastName"] as string,
   //       email: userInput["email"] as string | null,
   //       phoneNumber: userInput["phoneNumber"] as string | null,
   //       isAdmin: userInput["isAdmin"] as boolean,
   //       password: userInput["password"] as string
   //    }
   //    return updateUser(new ObjectId(userId), request);
   // }
}

export default resolvers;