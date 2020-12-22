import MongoService from "services/external/mongodb/client";
import { Budget, Payment, User } from "models/data";
import { WithId } from "mongodb";
import { publishToEndpoint } from "services/external/aws/sns";

export const processPaymentNotifications = async () => {
   const client = await MongoService.getInstance()
   const users = client.db("budgeter").collection<User>("users");
   const budgets = client.db("budgeter").collection<Budget>("budgets");
   const payments = client.db("budgeter").collection<Payment>("payments");
   const dayOfMonth = new Date().getDate();

   // Find all users that have a device
   const usersWithDevices = await users.find<WithId<User>>({ device: { $exists: true } });

   usersWithDevices.forEach(async (user) => {
      // Get all payments that are due today
      const paymentsDueToday = await payments.find<WithId<Payment>>({ userId: user._id, "$expr": { "$eq": [{ "$dayOfMonth": "$dueDate" }, dayOfMonth] } });

      paymentsDueToday.forEach(async (payment) => {
         // Make sure payment is within an active budget
         const activeBudgetCount = await budgets.countDocuments({ userId: user._id, completed: false, payments: { $elemMatch: { paymentId: payment._id, completed: false } } });
         if (activeBudgetCount > 0) {
            // Send notification
            publishToEndpoint(user.device.platformApplicationEndpointArn, `${payment.name} is due today for $${payment.amount}`)
         }
      })
   })
}