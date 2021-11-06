const EntityCollection = require("./collection");
const { getClient } = require("./connection");
const { MONGO_COLLECTIONS, MONGO_DATABASES } = require("utils/constants");

const collectionMap = {
   [MONGO_COLLECTIONS.ONE_TIME_CODES]: MONGO_DATABASES.SECURITY,
   [MONGO_COLLECTIONS.REFRESH_TOKENS]: MONGO_DATABASES.SECURITY,
   [MONGO_COLLECTIONS.USERS]: MONGO_DATABASES.ACCOUNTS,
   [MONGO_COLLECTIONS.DEVICES]: MONGO_DATABASES.ACCOUNTS,
   [MONGO_COLLECTIONS.PREFERENCES]: MONGO_DATABASES.ACCOUNTS
};

const getCollection = async (req, collectionName) => {
   const client = await getClient();
   const db = client.db(collectionMap[collectionName]);
   const collection = db.collection(collectionName);
   return new EntityCollection(req, collection);
};

module.exports.getOneTimeCodesCollection = async (req) =>
   await getCollection(req, MONGO_COLLECTIONS.ONE_TIME_CODES);

module.exports.getRefreshTokensCollection = async (req) =>
   await getCollection(req, MONGO_COLLECTIONS.REFRESH_TOKENS);

module.exports.getUsersCollection = async (req) =>
   await getCollection(req, MONGO_COLLECTIONS.USERS);

module.exports.getDevicesCollection = async (req) =>
   await getCollection(req, MONGO_COLLECTIONS.DEVICES);

module.exports.getPreferencesCollection = async (req) =>
   await getCollection(req, MONGO_COLLECTIONS.PREFERENCES);
