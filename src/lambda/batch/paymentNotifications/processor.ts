import { publishToEndpoint } from "services/external/aws/sns";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processPaymentNotifications = async () => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const paymentsService = budgeterClient.getPaymentsCollection();
   const today = new Date();
   const day = today.getDay();
   const date = today.getDate();
   const month = today.getMonth();
   const year = today.getFullYear();
   const numberFormat = new Intl.NumberFormat("en-us", { style: "currency", currency: "USD" });

   // Get all users with registered device and payment notifications turned on
   const usersToNotify = await usersService.findMany({
      "$and": [
         { device: { $exists: true } },
         //{ notificationPreferences: { paymentNotifications: true } }
      ]
   })

   // Determine their payments for today and send notification
   await Promise.all(usersToNotify.map(async (user) => {
      // Get user inccomes
      const payments = await paymentsService.findMany({
         "$or": [
            { initialMonth: month, initialYear: year, initialDate: date, userId: user._id, recurrence: "oneTime" },
            { userId: user._id, recurrence: "daily" },
            { initialDay: day, userId: user._id, recurrence: "weekly" },
            { initialDay: day, userId: user._id, recurrence: "biweekly" },
            { initialDate: date, userId: user._id, recurrence: "monthly" },
            { initialMonth: month, initialDate: date, recurrence: "yearly" }
         ]
      })
      payments.forEach(x => {
         // Send notification
         publishToEndpoint(user.device.platformApplicationEndpointArn, `${x.title} due today for ${numberFormat.format(x.amount)}`)
      })
   }))
}