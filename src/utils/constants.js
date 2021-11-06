module.exports.EMAIL_USER_IDENTIFIER_TYPE = "EMAIL";
module.exports.PHONE_USER_IDENTIFIER_TYPE = "PHONE";

module.exports.AUTH_ENDPOINT = "auth";
module.exports.CHALLENGE_ENDPOINT = "challenge";
module.exports.CONFIRM_ENDPOINT = "confirm";
module.exports.REFRESH_ENDPOINT = "refresh";
module.exports.GRAPHQL_ENDPOINT = "graphql";

module.exports.CHALLENGE_PATH = `/${module.exports.AUTH_ENDPOINT}/${module.exports.CHALLENGE_ENDPOINT}`;
module.exports.CONFIRM_PATH = `/${module.exports.AUTH_ENDPOINT}/${module.exports.CONFIRM_ENDPOINT}`;
module.exports.REFRESH_PATH = `/${module.exports.AUTH_ENDPOINT}/${module.exports.REFRESH_ENDPOINT}`;
module.exports.GRAPHQL_PATH = `/${module.exports.GRAPHQL_ENDPOINT}`;

module.exports.HTTP_METHODS = {
   POST: "POST",
   GET: "GET",
   OPTIONS: "OPTIONS"
};

module.exports.MONGO_DATABASES = {
   ACCOUNTS: "accounts",
   SECURITY: "security"
};
module.exports.MONGO_COLLECTIONS = {
   ONE_TIME_CODES: "oneTimeCodes",
   REFRESH_TOKENS: "refreshTokens",
   USERS: "users",
   DEVICES: "devices",
   PREFERENCES: "preferences"
};

module.exports.NEO4J_ENTITIES = {
   INCOMES: "Income",
   PAYMENTS: "Payment",
   PAYMENT_TAGS: "PaymentTag"
};
