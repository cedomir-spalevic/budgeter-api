export const EMAIL_USER_IDENTIFIER_TYPE = "EMAIL";
export const PHONE_USER_IDENTIFIER_TYPE = "PHONE";

export const AUTH_ENDPOINT = "auth";
export const CHALLENGE_ENDPOINT = "challenge";
export const CONFIRM_ENDPOINT = "confirm";
export const REFRESH_ENDPOINT = "refresh";
export const GRAPHQL_ENDPOINT = "graphql";

export const CHALLENGE_PATH = `/${AUTH_ENDPOINT}/${CHALLENGE_ENDPOINT}`;
export const CONFIRM_PATH = `/${AUTH_ENDPOINT}/${CONFIRM_ENDPOINT}`;
export const REFRESH_PATH = `/${AUTH_ENDPOINT}/${REFRESH_ENDPOINT}`;
export const GRAPHQL_PATH = `/${GRAPHQL_ENDPOINT}`;

export const HTTP_METHODS = {
   POST: "POST",
   GET: "GET"
};

export const MONGO_DATABASES = {
   ACCOUNTS: "accounts",
   SECURITY: "security"
};
export const MONGO_COLLECTIONS = {
   ONE_TIME_CODES: "oneTimeCodes",
   REFRESH_TOKENS: "refreshTokens",
   USERS: "users",
   DEVICES: "devices",
   PREFERENCES: "preferences"
};