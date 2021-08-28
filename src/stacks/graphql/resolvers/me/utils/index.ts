import { User, PublicUser } from "models/schemas/user"
import { WithId } from "mongodb"

export const transformResponse = (user: WithId<User>): PublicUser => ({
   firstName: user.firstName,
   lastName: user.lastName,
   email: user.email,
   phoneNumber: user.phoneNumber,
   isMfaVerified: user.isMfaVerified,
   createdOn: user.createdOn,
   modifiedOn: user.modifiedOn,
   device: {
      os: user.device ? user.device.os : null
   },
   notificationPreferences: {
      incomeNotifications: user.notificationPreferences.incomeNotifications,
      paymentNotifications: user.notificationPreferences.paymentNotifications
   }
})