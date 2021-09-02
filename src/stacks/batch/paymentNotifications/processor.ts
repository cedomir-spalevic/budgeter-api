import { User } from "models/schemas/user";
import { GetBudgetQueryStringParameters } from "models/requests";
import { publishToEndpoint } from "services/external/aws/sns";
import BudgeterMongoClient from "services/external/mongodb/client";
import { getBudgetPayments } from "services/internal/budgets/determine";
import { getBudgetPaymentQuery } from "services/internal/budgets/query";
import { transformResponse } from "stacks/graphql/resolvers/payments/utils";

const today = new Date();
const date = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();
const queryParams: GetBudgetQueryStringParameters = { date, month, year };
const numberFormat = new Intl.NumberFormat("en-us", {
   style: "currency",
   currency: "USD"
});

export const processPaymentNotifications = async (): Promise<void> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();

   // We only want to send any notifications to users
   // that have a registered device and wih the payment notifications preferences turned on
   const usersToNotify = await usersService.findMany({
      $and: [
         { device: { $exists: true } },
         { "notificationPreferences.paymentNotifications": true }
      ]
   });

   // Determine their incomes for today and send notification
   // Now we want to go through each user and determine which payments are due today
   // and send a push notification to them
   await Promise.all(usersToNotify.map(async (user) => await notifyUser(user)));
};

const notifyUser = async (user: User): Promise<void> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();

   const query = getBudgetPaymentQuery(user._id, queryParams);
   const nPayments = await paymentsService.findMany(query);
   const payments = nPayments.map(transformResponse);
   const dueTodayItems = getBudgetPayments(payments, queryParams).filter(
      (x) => x.dueToday
   );

   await Promise.all(
      dueTodayItems.map((x) =>
         publishToEndpoint(
            user.device.platformApplicationEndpointArn,
            `${x.title} due today for ${numberFormat.format(x.amount)}`
         )
      )
   );
};
