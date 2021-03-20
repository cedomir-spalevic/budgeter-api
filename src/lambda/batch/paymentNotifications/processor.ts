import { User } from "models/data/user";
import { publishToEndpoint } from "services/external/aws/sns";
import BudgeterMongoClient from "services/external/mongodb/client";

const today = new Date();
const day = today.getDay();
const date = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();
const numberFormat = new Intl.NumberFormat("en-us", {
   style: "currency",
   currency: "USD",
});

const notifyUser = async (user: User): Promise<void> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();
   
   const payments = await paymentsService.findMany({
      $and: [
         { userId: user._id },
         {
            $or: [
               {
                  initialMonth: month,
                  initialYear: year,
                  initialDate: date,
                  recurrence: "oneTime",
               },
               { recurrence: "daily" },
               { initialDay: day, recurrence: "weekly" },
               { initialDay: day, recurrence: "biweekly" },
               { initialDate: date, recurrence: "monthly" },
               {
                  initialMonth: month,
                  initialDate: date,
                  recurrence: "yearly",
               },
            ],
         },
      ],
   });

   await Promise.all(
      payments.map((x) =>
         publishToEndpoint(
            user.device.platformApplicationEndpointArn,
            `${x.title} due today for ${numberFormat.format(x.amount)}`
         )
      )
   );
}

export const processPaymentNotifications = async (): Promise<void> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();

   // We only want to send any notifications to users
   // that have a registered device and wih the payment notifications preferences turned on
   const usersToNotify = await usersService.findMany({
      $and: [
         { device: { $exists: true } },
         { "notificationPreferences.paymentNotifications": true },
      ],
   });

   // Determine their incomes for today and send notification
   // Now we want to go through each user and determine which payments are due today
   // and send a push notification to them
   await Promise.all(usersToNotify.map(async (user) => await notifyUser(user)));
};
