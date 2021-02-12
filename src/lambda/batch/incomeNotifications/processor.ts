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
         { "notificationPreferences.incomeNotifications": true }
      ]
   })

   // Determine their incomes for today and send notification
   await Promise.all(usersToNotify.map(async (user) => {
      // Get user inccomes
      const incomes = await incomesService.findMany({
         "$and": [
            { userId: user._id },
            {
               "$or": [
                  { initialMonth: month, initialYear: year, initialDate: date, recurrence: "oneTime" },
                  { recurrence: "daily" },
                  { initialDay: day, recurrence: "weekly" },
                  { initialDay: day, recurrence: "biweekly" },
                  { initialDate: date, recurrence: "monthly" },
                  { initialMonth: month, initialDate: date, recurrence: "yearly" }
               ]
            }
         ]
      })

      await Promise.all(incomes.map(x => publishToEndpoint(user.device.platformApplicationEndpointArn, `${x.title} expected today for ${numberFormat.format(x.amount)}`)))
   }))
}