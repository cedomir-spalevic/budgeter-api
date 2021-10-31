const { getUsersCollection, getDevicesCollection, getPreferencesCollection } = require("services/mongodb");
const { ObjectId } = require("mongodb");

module.exports.findUserById = async (req) => {
   const usersCollection = await getUsersCollection(req);
   const user = await usersCollection.find({
      _id: ObjectId(req.user.id)
   });
   return {
      id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdOn: user.createdOn,
      modifiedOn: user.modifiedOn
   };
};

module.exports.getUserDevices = async (req) => {   
   const devicesCollection = await getDevicesCollection(req);
   const devices = await devicesCollection.findMany({
      _id: req.user.id
   });
   return devices.map(device => ({
      os: device.os
   }));
};

module.exports.getUserPreferences = async (req) => {
   const preferencesCollection = await getPreferencesCollection(req);
   const preferences = await preferencesCollection.find({
      _id: req.user.id
   });
   return {
      incomeNotifications: preferences ? preferences.incomeNotifications : false,
      paymentNotifications: preferences ? preferences.paymentNotifications : false
   };
};