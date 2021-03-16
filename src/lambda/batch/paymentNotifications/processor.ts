import { publishToEndpoint } from "services/external/aws/sns";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processPaymentNotifications = async (): Promise<void> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const paymentsService = budgeterClient.getPaymentsCollection();
   const today = new Date();
   const day = today.getDay();
   const date = today.getDate();
   const month = today.getMonth();
   const year = today.getFullYear();
   const numberFormat = new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "USD",
   });

   // Get all users with registered device and payment notifications turned on
   const usersToNotify = await usersService.findMany({
      $and: [
         { device: { $exists: true } },
         { "notificationPreferences.paymentNotifications": true },
      ],
   });
   console.log(usersToNotify);

   // Determine their payments for today and send notification
   await Promise.all(
      usersToNotify.map(async (user) => {
         // Get user inccomes
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
      })
   );
};
