import { getDevicesCollection, getPreferencesCollection } from "../../services/mongodb/index.js";

export const resolvers = {
   User: {
      devices: async function(parent, args, { req }, info) {
         const devicesCollection = await getDevicesCollection(req);
         const devices = await devicesCollection.findMany({
            _id: req.user.id
         });
         return devices.map(device => ({
            os: device.os
         }));
      },
      preferences: async function(parent, args, { req }, info) {
         const preferencesCollection = await getPreferencesCollection(req);
         const preferences = await preferencesCollection.find({
            _id: req.user.id
         });
         return {
            incomeNotifications: preferences ? preferences.incomeNotifications : false,
            paymentNotifications: preferences ? preferences.paymentNotifications : false
         };
      }
   },
   UserInput: {
      devices: async function(parent, args, { req }, info) {
         let test = "test";
      }
   }
};