import { AdminPublicUser, User } from "models/schemas/user"
import { WithId } from "mongodb"

export const transformResponse = (user: WithId<User>): AdminPublicUser => ({
   id: user._id.toHexString(),
   firstName: user.firstName,
   lastName: user.lastName,
   email: user.email,
   phoneNumber: user.phoneNumber,
   isAdmin: user.isAdmin,
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