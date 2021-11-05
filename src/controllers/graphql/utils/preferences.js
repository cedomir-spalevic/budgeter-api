const { getPreferencesCollection } = require("services/mongodb");

const mapPreferences = (preferences) => {
   return {
      incomeNotifications: preferences
         ? preferences.incomeNotifications
         : false,
      paymentNotifications: preferences
         ? preferences.paymentNotifications
         : false
   };
};

const getUserPreferences = async (req) => {
   const preferencesCollection = await getPreferencesCollection(req);
   const preferences = await preferencesCollection.find({
      userId: req.user.id
   });
   return mapPreferences(preferences);
};

const updateUserPreferences = async (req, input) => {
   const preferencesCollection = await getPreferencesCollection(req);
   let preferences = await preferencesCollection.find({
      userId: req.user.id
   });
   let shouldUpdate = false;
   if (
      input.incomeNotifications !== undefined &&
      input.incomeNotifications !== preferences.incomeNotifications
   ) {
      preferences.incomeNotifications = input.incomeNotifications;
      shouldUpdate = true;
   }
   if (
      input.paymentNotifications !== undefined &&
      input.paymentNotifications !== preferences.paymentNotifications
   ) {
      preferences.paymentNotifications = input.paymentNotifications;
      shouldUpdate = true;
   }
   if (shouldUpdate) {
      preferences = await preferencesCollection.update(preferences);
   }
   return mapPreferences(preferences);
};

module.exports = {
   getUserPreferences,
   updateUserPreferences
};
