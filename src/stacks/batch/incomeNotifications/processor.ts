import { User } from "models/schemas/user";
import { GetBudgetQueryStringParameters } from "models/requests";
import { publishToEndpoint } from "services/external/aws/sns";
import BudgeterMongoClient from "services/external/mongodb/client";
import { getBudgetIncomes } from "services/internal/budgets/determine";
import { getBudgetIncomeQuery } from "services/internal/budgets/query";
import { transformResponse } from "stacks/graphql/resolvers/incomes/utils";

const today = new Date();
const date = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();
const queryParams: GetBudgetQueryStringParameters = { date, month, year };
const numberFormat = new Intl.NumberFormat("en-us", {
   style: "currency",
   currency: "USD"
});

export const processIncomeNotifications = async (): Promise<void> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();

   // We only want to send any notifications to users
   // that have a registered device and wih the income notifications preferences turned on
   const usersToNotify = await usersService.findMany({
      $and: [
         { device: { $exists: true } },
         { "notificationPreferences.incomeNotifications": true }
      ]
   });

   // Determine their incomes for today and send notification
   // Now we want to go through each user and determine which incomes should are expected for today
   // and send a push notification to them
   await Promise.all(usersToNotify.map(async (user) => await notifyUser(user)));
};

const notifyUser = async (user: User): Promise<void> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   const query = getBudgetIncomeQuery(user._id, queryParams);
   const nIncomes = await incomesService.findMany(query);
   const incomes = nIncomes.map(transformResponse);
   const dueTodayItems = getBudgetIncomes(incomes, queryParams).filter(
      (x) => x.dueToday
   );

   await Promise.all(
      dueTodayItems.map((x) =>
         publishToEndpoint(
            user.device.platformApplicationEndpointArn,
            `${x.title} expected today for ${numberFormat.format(x.amount)}`
         )
      )
   );
};
