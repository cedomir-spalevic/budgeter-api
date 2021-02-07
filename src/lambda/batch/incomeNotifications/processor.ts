import { publishToEndpoint } from "services/external/aws/sns";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processIncomeNotifications = async () => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const incomesService = budgeterClient.getIncomesCollection();
   const today = new Date();
   const day = today.getDay();
   const date = today.getDate();
   const month = today.getMonth();
   const year = today.getFullYear();
   const numberFormat = new Intl.NumberFormat("en-us", { style: "currency", currency: "USD" });

   // Get all users with registered device and income notifications turned on
   const usersToNotify = await usersService.findMany({
      "$and": [
         { device: { $exists: true } },
         //{ notificationPreferences: { incomeNotifications: true } } // TODO:
      ]
   })

   // Determine their incomes for today and send notification
   await Promise.all(usersToNotify.map(async (user) => {
      // Get user inccomes
      const incomes = await incomesService.findMany({
         "$or": [
            { initialMonth: month, initialYear: year, initialDate: date, userId: user._id, recurrence: "oneTime" },
            { userId: user._id, recurrence: "daily" },
            { initialDay: day, userId: user._id, recurrence: "weekly" },
            { initialDay: day, userId: user._id, recurrence: "biweekly" },
            { initialDate: date, userId: user._id, recurrence: "monthly" },
            { initialMonth: month, initialDate: date, recurrence: "yearly" }
         ]
      })
      incomes.forEach(x => {
         // Send notification
         publishToEndpoint(user.device.platformApplicationEndpointArn, `${x.title} expected today for ${numberFormat.format(x.amount)}`)
      })
   }))
}